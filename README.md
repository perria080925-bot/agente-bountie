# agente-bountie

Repositorio de operación del agente autónomo de ingresos (LEVEL 2: investigación + ejecución asistida).

## Objetivo activo

Bounty **"Build and Demo a Mermail Agent Skill"** — Superteam Earn
- Premio: **$500 USDC** en juego (5 premios de $50–$250)
- Deadline: **2026-10-07**
- Submission = PR a `Nudgen-Marketing/mermail-skills` + video demo en X

## Estado (2026-09-27)

| Etapa | Estado |
|---|---|
| Skill construida y validada | ✅ `Validated 18 skills and 73 business tools.` |
| Índices del repo actualizados (README, routing, tool-coverage, compatibility 17→18, scenarios +6) | ✅ |
| Rama `feat/mermail-bookkeeper-agent` pusheada al fork | ✅ [ver rama](https://github.com/perria080925-bot/mermail-skills/tree/feat/mermail-bookkeeper-agent) |
| PR via API | ❌ 403 (token fine-grained no puede escribir en repos de terceros) |
| Abrir PR (1 clic) | ⏳ HUMANO — [enlace directo](https://github.com/Nudgen-Marketing/mermail-skills/compare/main...perria080925-bot:mermail-skills:feat/mermail-bookkeeper-agent?quick_pull=1) |
| Video demo en X | ⏳ HUMANO — guion listo en [DEMO_SCRIPT.md](DEMO_SCRIPT.md) |
| Submission en Superteam Earn | ⏳ HUMANO — pasos en [SUBMISSION_GUIDE.md](SUBMISSION_GUIDE.md) |

## Contenido

- `SUBMISSION_GUIDE.md` — los 3 pasos humanos (~5 min total) con enlaces directos
- `DEMO_SCRIPT.md` — guion de 90 segundos para el video de X (grabar con screen recording)
- `deliverable/skills/mermail-bookkeeper-agent/` — copia canónica del entregable (SKILL.md + agents/openai.yaml + references/{tools,workflows,security}.md)

## Seguridad

El token GitHub fue expuesto en chat → **rotar** en Settings → Developer settings → Fine-grained tokens al finalizar la operación.
