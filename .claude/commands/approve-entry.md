---
description: Record independent review of a current library version
---

Read CLAUDE.md and docs/cli.md. Record independent review of a current library version.

Read entry and inspect its evidence. Use the actual reviewer identity supplied by the operator. Do not approve your own output under another name. An expired review date needs revise-entry first.

```bash
node scripts/tenders.mjs approve-entry --entry="<entry>" --actor="<actor>" --json
```

Replace placeholders with the actual supplied values. Read-only commands report missing facts as missing. For changes, show the affected record and the result. Nothing here sends, publishes or deletes.
