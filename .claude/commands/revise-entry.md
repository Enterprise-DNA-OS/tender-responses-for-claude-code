---
description: Revise a library answer and clear its approval
---

Read CLAUDE.md and docs/cli.md. Revise a library answer and clear its approval.

Read entry and reuse-impact first. Report affected tenders after the change. Existing tender text stays intact but its old library reference requires renewed review.

```bash
node scripts/tenders.mjs revise-entry --entry="<entry>" --answer="<answer>" --source="<source>" --review-due="<review-due>" --actor="<actor>" --json
```

Replace placeholders with the actual supplied values. Read-only commands report missing facts as missing. For changes, show the affected record and the result. Nothing here sends, publishes or deletes.
