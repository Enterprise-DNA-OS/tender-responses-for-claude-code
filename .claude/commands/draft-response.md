---
description: Draft a tender response pack for human review
---

Read CLAUDE.md and docs/cli.md. Draft a tender response pack for human review.

Read bid and submission-readiness first. The HTML draft visibly includes unfinished answers. Keep it under drafts/, report holds and never send it.

```bash
node scripts/tenders.mjs draft-response --bid="<bid>" --json
```

Replace placeholders with the actual supplied values. Read-only commands report missing facts as missing. For changes, show the affected record and the result. Nothing here sends, publishes or deletes.
