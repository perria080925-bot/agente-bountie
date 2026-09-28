# 🟢 x402 Endpoints LIVE — actualizado 2026-09-28

Desplegados y verificados en **Bankr x402 Cloud** (Base, USDC). Revenue real acumula aquí:
**Dashboard: https://bankr.bot/x402**

## Endpoints en producción (5)

| # | Endpoint | Precio | Función |
|---|----------|--------|---------|
| 1 | crypto-sentinel | $0.003 | Régimen BTC/ETH/SOL: precio, funding APR, volatilidad, crowding |
| 2 | funding-heatmap | $0.004 | Funding APR de 15 perps, rankeado, flags de crowding |
| 3 | token-safety | $0.01 | Screen heurístico rug/riesgo de tokens EVM (score 0-100 auditable) |
| 4 | market-signal | $0.001 | Snapshot + señales cuantitativas (SMA7/25, RSI-14, vol anualizada) |
| 5 | pair-scan | $0.005 | Scan agregado de pares DEX: liquidez, volumen, churn, hasta 6 pares |

Base URL común: `https://x402.bankr.bot/0xf436ca41bd0a236338bef57adeb4976677513010/<nombre>`

### Estado de indexación en marketplace (2026-09-28)

- HTTP 402 verificado en los 5 (gate de pago vivo)
- `bankr x402 search` con 6 queries relevantes + resultados profundos: **los 5 endpoints NO aparecen aún**
- Conclusión: el ranking del marketplace depende de uso; con 0 reqs somos invisibles al discovery orgánico
- Implicación: el primer dollar x402 requiere promoción externa (post X, comunidades) — NO autollamadas (§23)

## ⚡ NUEVO: Superteam Earn Agent Program (2026-09-28)

STE lanzó programa formal para agentes: submission directa desde el agente + claim humano.

- **Agente registrado**: `agente-bountie-copper-61` (agentId 72831e6a-...)
- **CLAIM CODE (humano)**: `6A4726B031AF544FE48E36D0`
- **Claim URL**: https://superteam.fun/earn/claim/6A4726B031AF544FE48E36D0
- **IMPORTANTE**: el humano debe completar su perfil de talent en STE antes de poder reclamar
- Estado: 0 listings agent-eligible vivos hoy; el agente queda monitoreando (`/api/agents/listings/live`)
- API key del agente: guardada en `secrets/ste_agent.json` (no exponer)

## Verificaciones realizadas

- [x] Deploy CLI exitoso (`bankr x402 deploy`, v1) — 5/5 endpoints activos
- [x] HTTP 402 con payment requirements correctos (USDC en Base, facilitador api.bankr.bot)
- [x] `bankr x402 list` → 5/5 `active`, 0 reqs, $0 earned (2026-09-28)
- [x] Schema público consultable (`bankr x402 schema <url>`) — agent-discovery listo
- [x] Marketplace search: NO indexados aún (ver sección de indexación arriba)
- [x] Campos de Binance fapi verificados contra el parseo del handler

## Wallets de cobro (reales)

| Chain | Address | Recibe |
|---|---|---|
| Base (EVM) | `0xf436ca41bd0a236338bef57adeb4976677513010` | USDC de llamadas x402 |
| Solana | `8HVYqQRSEuDJJymzEbHSHRukUL3FvvAE7Z2WYZbXuVWR` | USDC de bounties Superteam Earn |

**RefCode Bankr: `YVQGTN94-BNKR`** — comisiones por cada suscripción referida.

## Matemática hacia $1 real

| Escenario | Llamadas necesarias |
|---|---|
| Solo market-signal ($0.001) | ~1,000 |
| Solo crypto-sentinel ($0.003) | ~334 |
| Solo token-safety ($0.01) | ~100 |
| Mix razonable | ~280 |

## Post promocional X (actualizado a 5 endpoints)

```
5 paid crypto data endpoints now live on the x402 marketplace (USDC on Base):

• market-signal — $0.001 — SMA/RSI/vol signals for any coin
• crypto-sentinel — $0.003 — BTC/ETH/SOL regime + funding + crowding
• funding-heatmap — $0.004 — 15 perps ranked by |APR|
• pair-scan — $0.005 — DEX pair liquidity/volume scan
• token-safety — $0.01 — heuristic rug/risk score, auditable flags

Agents: discover via x402. Humans: curl + any x402 wallet.

Example: https://x402.bankr.bot/0xf436ca41bd0a236338bef57adeb4976677513010/crypto-sentinel?asset=BTC
```

## ✅ CHECKLIST HUMANA CONSOLIDADA (ordenada por deadline)

| # | Acción | Tiempo | Premio potencial | Deadline |
|---|--------|--------|------------------|----------|
| 1 | **Moony**: publicar thread (MOONY_TIPS_POST.md) + submit | ~5 min | $300 USDC (5 premios) | **3 días** |
| 2 | **STREAM**: publicar post/hilo (STREAM_BURN_POST.md) + submit | ~5 min | $500 USDC (5x$100) | 11 días |
| 3 | **Mentioned**: registro + team + 1 trade ($0.50) + thread (MENTIONED_ARENA_POST.md) | ~15 min | $500 USDG (5x$100, solo 5 subs) | 13 días |
| 4 | **Completar perfil STE** (para poder reclamar payouts del agente) con claimCode `6A4726B031AF544FE48E36D0` | ~3 min | habilita todo el pipeline agente | cuando sea |
| 5 | **Promo x402**: publicar el post X de arriba | ~2 min | ingresos recursivos | cuando sea |
| 6 | **Mermail PR #401**: ya submitted — solo esperar | 0 min | $50–$250 | sorteo 16-oct |

## Cómo probar un pago real (opcional, para el usuario)

Desde cualquier wallet con USDC en Base (ej. Coinbase Wallet + el SDK x402, o el CLI: `bankr x402 call <url>`), una llamada paga $0.003 — **pago externo real** que se ve en el dashboard. NOTA: el agente NO se autopaga (wash-trading prohibido, §23) — el primer dólar debe venir de un tercero.

## Comandos de seguimiento

```bash
bankr x402 list          # estado + reqs + revenue
bankr x402 revenue       # earnings detallado
bankr x402 search <q>    # ranking en marketplace
```
