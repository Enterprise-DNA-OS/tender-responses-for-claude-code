---
description: Record an award, loss or no-bid decision
---

Read CLAUDE.md and docs/cli.md. Record an award, loss or no-bid decision.

Won or lost requires a recorded submission. No-bid requires an open bid. Read the bid first and record the operator’s reason. Never infer an award.

```bash
node scripts/tenders.mjs record-outcome --bid="<bid>" --outcome="<outcome>" --note="<note>" --actor="<actor>" --json
```

Replace placeholders with the actual supplied values. Read-only commands report missing facts as missing. For changes, show the affected record and the result. Nothing here sends, publishes or deletes.
