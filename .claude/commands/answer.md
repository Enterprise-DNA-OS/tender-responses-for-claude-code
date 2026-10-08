---
description: Write a sourced answer and clear its previous approval
---

Read CLAUDE.md and docs/cli.md. Write a sourced answer and clear its previous approval.

Read the relevant records first. Resolve partial names using the CLI. If a lookup is ambiguous, show the candidates and obtain the intended record. Use real evidence and operator-supplied values.

```bash
node scripts/tenders.mjs answer --question="<question>" --answer="<answer>" --source="<source>" --actor="<actor>" --json
```

Replace placeholders with the actual supplied values. Read-only commands report missing facts as missing. For changes, show the affected record and the result. Nothing here sends, publishes or deletes.
