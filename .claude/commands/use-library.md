---
description: Copy a current approved library answer for local bid review
---

Read CLAUDE.md and docs/cli.md. Copy a current approved library answer for local bid review.

Read question and entry first. Check applicability to this customer. A library approval does not approve the tender answer. Run approve-answer only after an independent person reviews it.

```bash
node scripts/tenders.mjs use-library --question="<question>" --entry="<entry>" --actor="<actor>" --json
```

Replace placeholders with the actual supplied values. Read-only commands report missing facts as missing. For changes, show the affected record and the result. Nothing here sends, publishes or deletes.
