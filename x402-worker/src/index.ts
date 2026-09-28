/**
 * x402 Sentinel Worker — own-origin x402 v2 endpoint with full discovery compliance.
 *
 * - Paywall: @x402/hono v2 (x402Version 2), Base mainnet (eip155:8453), USDC
 * - Discovery: Bazaar extension (input/output schema in every 402) + /openapi.json
 * - Runs on: Cloudflare Workers (deploy) and Node (local test via tsx)
 *
 * Revenue wallet: 0xf436ca41bd0a236338bef57adeb4976677513010 (Base)
 */
import { Hono } from "hono";
import { paymentMiddleware, x402ResourceServer } from "@x402/hono";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { declareDiscoveryExtension } from "@x402/extensions/bazaar";

const PAYTO = "0xf436ca41bd0a236338bef57adeb4976677513010";
const NETWORK = "eip155:8453"; // Base mainnet
// Bankr public facilitator (supports Base mainnet USDC, no auth needed).
// Alternative: https://x402.org/facilitator (testnet-only for mainnet routes).
const FACILITATOR_URL = "https://api.bankr.bot/facilitator";

const PORT = Number((globalThis as any).__PORT ?? 8787);

// ---------------------------------------------------------------------------
// Business logic (deterministic, no LLM, ~100ms)
// ---------------------------------------------------------------------------
const SYMBOLS: Record<string, string> = { BTC: "BTCUSDT", ETH: "ETHUSDT", SOL: "SOLUSDT" };

interface Snapshot {
  asset: string;
  price_usd: number;
  change_24h_pct: number;
  volume_24h_usd: number;
  funding_rate_8h_pct: number;
  funding_apr_pct: number;
  regime: "NEUTRAL" | "HIGH_VOL" | "CROWDED_LONG" | "CROWDED_SHORT";
  regime_reasons: string[];
  interpretation: string;
  source: string;
  ts: string;
}

function classify(chg24h: number, apr: number): { regime: Snapshot["regime"]; reasons: string[] } {
  const reasons: string[] = [];
  let regime: Snapshot["regime"] = "NEUTRAL";
  if (Math.abs(chg24h) >= 8) {
    regime = "HIGH_VOL";
    reasons.push(`24h move ${chg24h.toFixed(2)}% >= 8% volatility threshold`);
  }
  if (apr > 50) {
    regime = "CROWDED_LONG";
    reasons.push(`funding APR ${apr.toFixed(1)}% > +50%: longs pay, crowded long side`);
  } else if (apr < -25) {
    regime = "CROWDED_SHORT";
    reasons.push(`funding APR ${apr.toFixed(1)}% < -25%: shorts pay, crowded short side`);
  }
  if (regime === "NEUTRAL") reasons.push("no volatility or crowding threshold crossed");
  return { regime, reasons };
}

async function fetchSnapshot(asset: string): Promise<Snapshot> {
  const sym = SYMBOLS[asset] ?? SYMBOLS.BTC;
  let price = 0, chg = 0, vol = 0, rate8h = 0, source = "binance-fapi";

  try {
    const [t24, pm] = await Promise.all([
      fetch(`https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=${sym}`).then(r => r.json()),
      fetch(`https://fapi.binance.com/fapi/v1/premiumIndex?symbol=${sym}`).then(r => r.json()),
    ]);
    price = parseFloat(t24.lastPrice);
    chg = parseFloat(t24.priceChangePercent);
    vol = parseFloat(t24.quoteVolume);
    rate8h = parseFloat(pm.lastFundingRate) * 100;
  } catch {
    // CoinGecko fallback (spot only, funding unavailable -> 0)
    const id: Record<string, string> = { BTC: "bitcoin", ETH: "ethereum", SOL: "solana" };
    const cg = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${id[asset]}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`
    ).then(r => r.json());
    const node = cg[id[asset]];
    price = node.usd;
    chg = node.usd_24h_change ?? 0;
    vol = node.usd_24h_vol ?? 0;
    rate8h = 0;
    source = "coingecko-fallback";
  }

  const apr = rate8h * 3 * 365;
  const { regime, reasons } = classify(chg, apr);

  const interpretation =
    regime === "CROWDED_LONG"
      ? "Funding is expensive for longs; upside chase risk elevated. Mean-reversion or caution favored."
      : regime === "CROWDED_SHORT"
        ? "Funding is expensive for shorts; downside squeeze risk elevated."
        : regime === "HIGH_VOL"
          ? "Volatility regime active; reduce leverage and widen stops."
          : "Market in neutral regime; no structural edge from funding or volatility.";

  return {
    asset,
    price_usd: price,
    change_24h_pct: chg,
    volume_24h_usd: vol,
    funding_rate_8h_pct: rate8h,
    funding_apr_pct: apr,
    regime,
    regime_reasons: reasons,
    interpretation,
    source,
    ts: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Discovery schemas (Bazaar extension + openapi.json)
// ---------------------------------------------------------------------------
const sentinelInputSchema = {
  type: "object",
  properties: {
    asset: {
      type: "string",
      enum: ["BTC", "ETH", "SOL"],
      description: "Asset to snapshot. Defaults to BTC.",
    },
  },
};

const sentinelOutputExample = {
  asset: "BTC",
  price_usd: 84360,
  change_24h_pct: 0.53,
  volume_24h_usd: 21400000000,
  funding_rate_8h_pct: 0.0015,
  funding_apr_pct: 4.0,
  regime: "NEUTRAL",
  regime_reasons: ["no volatility or crowding threshold crossed"],
  interpretation: "Market in neutral regime; no structural edge from funding or volatility.",
  source: "binance-fapi",
  ts: "2026-09-28T04:00:00.000Z",
};

const sentinelExtension = declareDiscoveryExtension({
  method: "GET",
  input: { asset: "BTC" },
  inputSchema: sentinelInputSchema,
  output: { example: sentinelOutputExample },
});

// ---------------------------------------------------------------------------
// App + paywall
// ---------------------------------------------------------------------------
const app = new Hono();

// Bankr's public facilitator implements POST /verify + /settle (mainnet Base USDC)
// but not GET /supported -> override getSupported() with the exact kinds we use.
class BankrFacilitatorClient extends HTTPFacilitatorClient {
  constructor() { super({ url: FACILITATOR_URL }); }
  async getSupported() {
    return {
      kinds: [
        {
          x402Version: 2,
          scheme: "exact",
          network: NETWORK,
          extra: { name: "USD Coin", version: "2" },
        },
      ],
      extensions: ["bazaar"],
    } as any;
  }
}

const facilitatorClient = new BankrFacilitatorClient();
const resourceServer = new x402ResourceServer(facilitatorClient).register(
  NETWORK,
  new ExactEvmScheme(),
);

app.use(
  paymentMiddleware(
    {
      "/crypto-sentinel": {
        accepts: {
          scheme: "exact",
          price: "$0.003",
          network: NETWORK,
          payTo: PAYTO,
        },
        description:
          "Market regime & funding snapshot for BTC/ETH/SOL perps: price, 24h change, funding APR, volatility and long/short crowding regime in one deterministic call. No LLM, ~100ms.",
        extensions: sentinelExtension,
      },
    },
    resourceServer,
  ),
);

// Free routes ---------------------------------------------------------------
app.get("/", c =>
  c.json({
    service: "x402-sentinel",
    version: "v1",
    description: "Paid crypto market regime API (x402 v2, USDC on Base).",
    endpoints: {
      "GET /crypto-sentinel?asset=BTC|ETH|SOL": "$0.003 — regime + funding snapshot",
      "GET /openapi.json": "free — machine-readable contract (OpenAPI 3.1)",
    },
    discovery: "x402 Bazaar extension included in 402 challenges",
    agent_guidance:
      "To call: send HTTP GET; you will receive a 402 with payment requirements (USDC on Base). Pay via any x402 client/facilitator and retry with the X-PAYMENT header.",
  }),
);

app.get("/openapi.json", c =>
  c.json({
    openapi: "3.1.0",
    info: {
      title: "x402 Sentinel — Market Regime API",
      version: "1.0.0",
      "x-guidance":
        "One paid endpoint: GET /crypto-sentinel?asset=BTC|ETH|SOL returns a deterministic perps regime snapshot (price, 24h change, funding APR, volatility and crowding regime). Payment is x402 v2 exact scheme, USDC on Base, $0.003 per call. Handle the 402 challenge with any x402 client, then retry with the payment header.",
    },
    paths: {
      "/crypto-sentinel": {
        get: {
          summary: "Market regime & funding snapshot for BTC/ETH/SOL perps",
          description:
            "Deterministic snapshot from Binance USD-M fapi (CoinGecko fallback). $0.003 USDC on Base via x402.",
          "x-payment-info": {
            price: { mode: "fixed", currency: "USD", amount: "0.003" },
            protocols: [{ x402: {} }],
          },
          parameters: [
            {
              name: "asset",
              in: "query",
              required: false,
              schema: { type: "string", enum: ["BTC", "ETH", "SOL"], default: "BTC" },
              description: "Asset to snapshot",
            },
          ],
          responses: {
            200: {
              description: "Regime snapshot",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Snapshot" },
                  example: sentinelOutputExample,
                },
              },
            },
            "402": { description: "Payment Required — x402 challenge" },
          },
        },
      },
    },
    components: {
      schemas: {
        Snapshot: {
          type: "object",
          properties: {
            asset: { type: "string" },
            price_usd: { type: "number" },
            change_24h_pct: { type: "number" },
            volume_24h_usd: { type: "number" },
            funding_rate_8h_pct: { type: "number" },
            funding_apr_pct: { type: "number" },
            regime: { type: "string", enum: ["NEUTRAL", "HIGH_VOL", "CROWDED_LONG", "CROWDED_SHORT"] },
            regime_reasons: { type: "array", items: { type: "string" } },
            interpretation: { type: "string" },
            source: { type: "string" },
            ts: { type: "string", format: "date-time" },
          },
        },
      },
    },
  }),
);

// Paid route ----------------------------------------------------------------
app.get("/crypto-sentinel", async c => {
  const raw = c.req.query("asset") ?? "BTC";
  const asset = (raw.toUpperCase() in SYMBOLS ? raw.toUpperCase() : "BTC") as keyof typeof SYMBOLS;
  try {
    const snap = await fetchSnapshot(asset);
    return c.json(snap);
  } catch (e) {
    return c.json({ error: "upstream_failed", detail: String(e) }, 503);
  }
});

// Node entry (local test). Workers entry is the default export.
if (import.meta.url === `file://${process.argv[1]}`) {
  const { serve } = await import("@hono/node-server");
  console.log(`x402-sentinel listening on http://localhost:${PORT}`);
  serve({ fetch: app.fetch, port: PORT });
}

export default app;
