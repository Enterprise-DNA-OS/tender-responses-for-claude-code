---
description: Review open bids before committing the team
---

Read CLAUDE.md and docs/cli.md. Review open bids before committing the team.

Read the relevant records first. Resolve partial names using the CLI. If a lookup is ambiguous, show the candidates and obtain the intended record. Use real evidence and operator-supplied values.

```bash
node scripts/tenders.mjs bid-triage --json
```

Replace placeholders with the actual supplied values. Read-only commands report missing facts as missing. For changes, show the affected record and the result. Nothing here sends, publishes or deletes.
