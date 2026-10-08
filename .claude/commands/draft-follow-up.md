---
description: Draft a reviewer follow-up without sending
---

Read CLAUDE.md and docs/cli.md. Draft a reviewer follow-up without sending.

Read the bid before drafting. Keep the result in drafts/. Present named owners and missing evidence, never invent commitments or send messages.

```bash
node scripts/tenders.mjs draft-follow-up --bid="<bid>" --json
```

Replace placeholders with the actual supplied values. Read-only commands report missing facts as missing. For changes, show the affected record and the result. Nothing here sends, publishes or deletes.
