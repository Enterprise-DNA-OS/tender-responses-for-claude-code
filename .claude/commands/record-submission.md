---
description: Record a submission that a person has already made
---

Read CLAUDE.md and docs/cli.md. Record a submission that a person has already made.

This records history only and sends nothing. Require the operator’s real submission receipt or reference. Read submission-readiness first. Never treat readiness as authority to submit to a portal.

```bash
node scripts/tenders.mjs record-submission --bid="<bid>" --receipt="<receipt>" --actor="<actor>" --json
```

Replace placeholders with the actual supplied values. Read-only commands report missing facts as missing. For changes, show the affected record and the result. Nothing here sends, publishes or deletes.
