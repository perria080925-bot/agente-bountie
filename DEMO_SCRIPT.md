# Guion Video Demo — 90 segundos (para X)

Grabar pantalla del PR en GitHub mientras se lee el guion. Tono: directo, técnico.

## Texto a leer (en inglés, tal cual)

**[0:00–0:08 — Hook / pantalla: PR abierto]**
> "I built a new Mermail agent skill that turns receipts and invoices into an auditable spend ledger — here's the PR."

**[0:08–0:25 — Pantalla: SKILL.md en el PR]**
> "The skill is called mermail-bookkeeper-agent. You forward receipts and invoices, and it builds a clean CSV ledger: vendor, amount, currency, date, tax and category — all extracted and normalized."

**[0:25–0:45 — Pantalla: references/workflows.md]**
> "It dedupes by email ID plus a content fingerprint, flags anomalies — duplicates, tax mismatches, vendor spikes, currency changes — and every flag quotes the evidence, so the ledger is fully auditable."

**[0:45–1:00 — Pantalla: references/security.md]**
> "Security-wise: bounded reads with a hard 60-email cap, digest is draft-only by default, and nothing sends without an exact preview and fresh approval."

**[1:00–1:15 — Pantalla: archivos del PR + índices]**
> "It reuses tools from existing official skills — no new tool claims. And all repo indexes are updated: routing, README, compatibility — now 18 skills — plus six new test scenarios."

**[1:15–1:25 — Pantalla: terminal con `node tests/validate.mjs`]**
> "And it passes the full validator: 18 skills and 73 business tools validated."

**[1:25–1:30 — Cierre]**
> "PR is open — link below. Built for the Mermail Agent Skill bounty on Superteam Earn."

## Texto sugerido para el tweet

```
Just open-sourced a new Mermail agent skill: mermail-bookkeeper-agent 📒

Receipts + invoices → auditable spend ledger. Dedupe, anomaly flags with
quoted evidence, draft-only digests, bounded reads.

Passes the full repo validator (18 skills / 73 tools).

PR: <link-del-PR>
#Mermail #AgentSkills #Solana
```

## Tips de grabación

- Usar zoom del navegador al 110–125% para que el texto se lea en móvil.
- Grabar a 1080p o superior; 30 fps es suficiente.
- Si no hay micrófono: grabar solo pantalla y usar el texto como subtítulos o voice-over posterior.
- Mantener el cursor moviéndose hacia lo que se menciona (guía la mirada).
