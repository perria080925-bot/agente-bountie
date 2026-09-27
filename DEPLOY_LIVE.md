# 🟢 x402 Endpoints LIVE — 2026-09-27

Desplegados y verificados en **Bankr x402 Cloud** (Base, USDC). Revenue real acumula aquí:
**Dashboard: https://bankr.bot/x402**

## Endpoints en producción

### 1. crypto-sentinel — $0.003/req
```
https://x402.bankr.bot/0xf436ca41bd0a236338bef57adeb4976677513010/crypto-sentinel?asset=BTC
```
Snapshot de régimen de mercado (BTC/ETH/SOL): precio, cambio 24h, funding APR, régimen de volatilidad y crowding long/short. Fuentes: Binance USD-M fapi (fallback CoinGecko). Determinístico, sin LLM.

### 2. funding-heatmap — $0.004/req
```
https://x402.bankr.bot/0xf436ca41bd0a236338bef57adeb4976677513010/funding-heatmap?limit=10
```
Heatmap de funding de 15 perps majors: APR anualizado rankeado por |APR| con flags crowded_long / crowded_short. 1 llamada reemplaza scrapear N feeds.

## Verificaciones realizadas

- [x] Deploy CLI exitoso (`bankr x402 deploy`, v1) para ambos
- [x] HTTP 402 con payment requirements correctos (3000 / 4000 units = $0.003 / $0.004 USDC en Base)
- [x] `bankr x402 list` → ambos `active`
- [x] Campos de Binance fapi verificados contra el parseo del handler
- [x] Marketplace: discovery automático de agentes activo (indexación en curso al momento del deploy)

## Wallets de cobro (reales)

| Chain | Address | Recibe |
|---|---|---|
| Base (EVM) | `0xf436ca41bd0a236338bef57adeb4976677513010` | USDC de llamadas x402 |
| Solana | `8HVYqQRSEuDJJymzEbHSHRukUL3FvvAE7Z2WYZbXuVWR` | USDC de bounties Superteam Earn |

**RefCode Bankr: `YVQGTN94-BNKR`** — comisiones por cada suscripción referida.

## Matemática hacia $1 real

| Escenario | Llamadas necesarias |
|---|---|
| Solo crypto-sentinel ($0.003) | ~334 |
| Solo funding-heatmap ($0.004) | ~250 |
| Mix razonable | ~280 |

## Post promocional X (listo para publicar)

```
Two paid data endpoints now live on the x402 marketplace (USDC on Base):

1. crypto-sentinel — $0.003
   BTC/ETH/SOL regime snapshot: funding APR, volatility + long/short
   crowding flags. One call instead of scraping 3 APIs.

2. funding-heatmap — $0.004
   15 perps scanned, ranked by |funding APR|, crowding flags included.

Agents: discover via x402. Humans: curl + any x402 wallet.

https://x402.bankr.bot/0xf436ca41bd0a236338bef57adeb4976677513010/crypto-sentinel?asset=BTC
```

## Cómo probar un pago real (opcional, para el usuario)

Desde cualquier wallet con USDC en Base (ej. Coinbase Wallet + el SDK x402, o el CLI: `bankr x402 call <url>`), una llamada paga $0.003 — **pago externo real** que se ve en el dashboard. NOTA: el agente NO se autopaga (wash-trading prohibido, §23) — el primer dólar debe venir de un tercero.

## Comandos de seguimiento

```bash
bankr x402 list          # estado + reqs + revenue
bankr x402 revenue       # earnings detallado
bankr x402 search <q>    # ranking en marketplace
```
