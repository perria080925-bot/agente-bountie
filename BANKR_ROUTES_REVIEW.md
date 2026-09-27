# Revisión de rutas Bankr sin capital — verificada contra docs oficiales (2026-09-27)

Fuentes: docs.bankr.bot → `/guides/zero-to-earning`, `/x402-cloud/overview`, `/apps/overview`, `/faq/getting-started`.

## Veredicto ejecutivo

| Ruta | Veredicto | Requisito real | EV honesto |
|---|---|---|---|
| **B. x402 endpoints** | 🥇 **PRINCIPAL** | Cuenta Bankr + Club/Max Mode | $1 = ~334 llamadas a $0.003; discovery incluido |
| **C. Apps/dashboards** | 🥈 **AMPLIFICADOR de B** | Misma cuenta | El visitante paga cada llamada x402 (con su confirmación) |
| **A. Referidos Club** | 🥉 PARALELO pasivo | Código de referido + publicar contenido | Comisiones compuestas; depende del tráfico X |
| **D. Fees de creador (token)** | ⏸️ DIFERIDA | Club + audiencia real que tradee | $0 sin comunidad; §23 prohíbe volumen propio |

**Hallazgo clave que cambia el mapa:** x402 Cloud ya incluye **hosting + cobro + marketplace pública + discovery automático por agentes**. El riesgo de distribución que bloqueaba esta ruta en ciclos anteriores quedó resuelto por la plataforma.

## Ruta B — x402 Cloud (detallada)

- El handler `crypto-sentinel` (BTC/ETH/SOL regime snapshot) **ya está escrito y cumple el spec exacto** `Request → Response`.
- Precio: $0.003/req en USDC (Base). *Settle-after-response*: solo cobra si la respuesta es OK.
- URL resultante: `https://x402.bankr.bot/<wallet>/<name>` + listado en marketplace.
- Dashboard de ingresos: bankr.bot/x402 (uso, revenue, logs).

### Pasos exactos del usuario (~10 min)

1. Cuenta en bankr.bot → suscripción **Bankr Club** o activar **Max Mode** (verificar precio al entrar; la docs confirman que el agente requiere Club o Max Mode con créditos LLM).
2. **Vía chat (sin instalar nada)** — pegar este prompt:

```
create an x402 endpoint called "crypto-sentinel" that takes an ?asset=
query param (BTC, ETH or SOL) and returns a JSON market regime snapshot:
price, 24h change, 8h funding rate, annualized funding APR, volatility
regime (calm/elevated based on |24h move| >= 8%) and crowding regime
(crowded_long if funding APR > +50%, crowded_short if < -25%, else neutral).
Fetch data from https://fapi.binance.com/fapi/v1/premiumIndex and
fapi/v1/ticker/24hr for the perp symbol (e.g. BTCUSDT), with CoinGecko
simple/price as fallback. Charge $0.003 per request.
```

3. **Vía CLI (alternativa)**: `npm i -g @bankr/cli && bankr login && bankr x402 deploy` con el código de `x402/crypto-sentinel/index.ts`.
4. Verificar en bankr.bot/x402 que el endpoint quedó listado. Enviarme la URL para monitoreo.

### Matemática de ingresos

| Llamadas/día | Ingreso mensual |
|---|---|
| 10 | ~$0.90 |
| 40 | ~$3.60 |
| 120 | ~$10.80 |

Con marketplace + discovery + promoción en X, 10–40 llamadas/día es alcanzable → **la meta de $1 real se cubre con la primera decena de llamadas**.

## Ruta C — Apps (converge con B)

- Bankr construye mini-dashboards desde lenguaje natural, instalados bajo tu wallet, con **link público compartible**.
- Las Apps pueden llamar endpoints x402: **la wallet del visitante paga** cada llamada (confirmación explícita por llamada — 100% opuesto a wash-trading, §23 limpio).

### Prompt exacto (después de desplegar el endpoint de la ruta B)

```
build me a public "Perps Regime Terminal" app — three panels (BTC, ETH, SOL),
each showing price, 24h change, funding APR and regime badge (calm/elevated,
crowded long/short/neutral). Each panel has a refresh button that calls my
x402 endpoint https://x402.bankr.bot/<WALLET>/crypto-sentinel?asset=BTC
(via bankr.x402.fetch). Refresh every 30 minutes automatically. Share it as
a public link.
```

- Distribución: postear el link público en X (mismo flujo que los posts de bounty) + reply en comunidades de agentes IA.
- Efecto: cada visitante que refresca paga $0.003 → el dashboard se promociona solo.

## Ruta A — Referidos Club (paralelo, $0)

- Mecanismo confirmado: comisión por suscripción activa referida.
- Acción del agente: hilo de X promocionando Bankr + tu código (listo para cuando tengas el código).
- Sinergia: el contenido de STREAM/Mermail ya te pone en modo "publicar en X" — el hilo de referidos se añade a la misma tanda.
- Realidad: sin audiencia previa la conversión es baja; es cola, no cabeza.

## Ruta D — Fees de creador (diferida)

- La guía "Zero to Earning" confirma: gas **patrocinado** (no hace falta ETH), fees se acumulan solos y se reclaman por prompt.
- PERO: fees = volumen de OTROS. Sin comunidad/utilidad → $0. §23 prohíbe autovolumen.
- La propia docs: "Tokens need utility... Build a community".
- **Plan**: relanzar esta ruta solo cuando el endpoint x402 y la App tengan usuarios reales (el token del agente tendría utilidad + audiencia inicial).

## Nota sobre gas

La consideración operativa "interacciones on-chain requieren gas" queda **mitigada dentro de Bankr**: la docs confirma gas patrocinado en las chains soportadas para operaciones del agente (deploy, claims). Fuera de Bankr (ej. Solana/STE), los pagos recibidos en USDC no cobran gas al receptor.

## Secuencia óptima integrada (esta semana)

1. **HOY (tú, ~12 min):** STREAM post en X + submit (3 min) → cuenta Bankr + Club/Max (5 min) → prompt de deploy crypto-sentinel (2 min) → código de referido anotado (1 min)
2. **Tras deploy (yo):** monitoreo de llamadas/ingresos + prompt de la App "Perps Regime Terminal" listo para pegar + hilo de referidos redactado
3. **En paralelo (ambos):** bounty Mentioned si confirmas que el trade es free; PR #401 en seguimiento
4. **Al llegar el primer USDC real** (bounty o x402): objetivo ≥$1 CUMPLIDO — y la tanda 2 se activa (token con utilidad, más endpoints)
