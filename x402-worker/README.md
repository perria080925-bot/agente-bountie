# x402 Sentinel Worker — endpoint propio con discovery completo

Worker de Cloudflare (free tier) que sirve el endpoint `crypto-sentinel` en **origin propio**
con pago x402 v2 (USDC en Base) y discovery de nivel máximo:

| Capability | Estado |
|---|---|
| 402 challenge x402 v2 (header `payment-required`, base64) | ✅ verificado |
| Bazaar extension (`extensions.bazaar` con schema input/output en cada 402) | ✅ verificado |
| `/openapi.json` (OpenAPI 3.1 + `x-payment-info` + `info.x-guidance`) | ✅ verificado |
| Auditoría oficial x402scan (`@agentcash/discovery`) | ✅ `GET paid 0.003 USD [x402]` |
| Settlement DIRECTO a nuestra wallet (sin intermediario de plataforma) | ✅ payTo = 0xf436...3010 |
| Secretos requeridos | 0 (paywall public-key) |

**Por qué importa:** los endpoints hosteados en x402.bankr.bot NO pueden registrarse en
x402scan (el origin compartido no publica `/openapi.json` y el 402 de Bankr no incluye la
extensión Bazaar). Este worker en origin propio desbloquea:
1. **x402scan.com** — el marketplace/directorio x402 con volumen real ($42K/24h, 4.4K buyers)
2. **Coinbase Bazaar** — discovery estándar para cualquier agente x402
3. SEO propio + control total del pricing y del código

## Deploy (humano, ~10 min)

```bash
cd x402-worker
npm install
npx wrangler login        # abre browser -> login Cloudflare (cuenta free)
npx wrangler deploy       # -> https://x402-sentinel.<tu-subdominio>.workers.dev
```

## Verificación post-deploy

```bash
URL=https://x402-sentinel.<tu-subdominio>.workers.dev

# 1) 402 challenge correcto
curl -i "$URL/crypto-sentinel" | head -12

# 2) Auditoría oficial (debe decir: GET paid 0.003 USD [x402])
npx -y @agentcash/discovery@latest discover "$URL"

# 3) Precio y payTo correctos dentro del challenge (base64 del header payment-required)
curl -s -i "$URL/crypto-sentinel" | rg payment-required
```

## Registro en x402scan (después de verificar)

1. Ir a https://www.x402scan.com/resources/register
2. Pegar el origin: `x402-sentinel.<tu-subdominio>.workers.dev`
3. El crawler sondea `/openapi.json` + cada ruta -> sin errores = registrado
4. Opcional (API): `POST https://x402scan.com/api/x402/registry/register-origin` con
   `{"origin": "$URL"}` (requiere auth SIWX de wallet via agentcash MCP)

> Nota de la spec oficial de x402scan: el registro crea un listing público — confirmar
> antes de publicar y correr `discover` hasta que esté limpio.

## Local (para iterar sin deploy)

```bash
npm run dev               # sirve en http://localhost:8787
npx -y @agentcash/discovery@latest check http://localhost:8787/crypto-sentinel
```

## Arquitectura

```
src/index.ts
├── GET /                    (free)  info + agent guidance
├── GET /openapi.json        (free)  contrato OpenAPI 3.1 + x-payment-info
└── GET /crypto-sentinel     ($0.003, x402 v2 exact, USDC Base)
      └── Binance fapi (precio/24h/funding) -> fallback CoinGecko
      └── regimenes: NEUTRAL | HIGH_VOL (|24h|>=8%) | CROWDED_LONG (APR>50%) | CROWDED_SHORT (APR<-25%)
```

Facilitador: `api.bankr.bot/facilitator` (público, verify+settle mainnet). El worker
declara sus kinds localmente (`BankrFacilitatorClient`) porque ese facilitador no expone
`GET /supported`.

## Pendiente opcional

- `info.contact.email` en `/openapi.json`: poner el email real del dueño (verificación de
  ownership en x402scan + página de merchant). No lo inventamos por seguridad (§32/§33).
- Segundo endpoint (funding-heatmap) reutilizando el mismo origin cuando el primero tenga
  tráfico.
