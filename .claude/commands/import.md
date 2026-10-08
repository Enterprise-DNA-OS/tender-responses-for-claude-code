---
description: Import an AutoRFP.ai backup saved as CSV
---

Read CLAUDE.md and docs/cli.md. Import an AutoRFP.ai backup saved as CSV.

Read docs/replace-autorfp.md. Inspect headers and map them explicitly. Run with --dry-run first, show row counts and rejected fields, then run the approved import. Blank answers remain blank. Imported answers have no trusted evidence or approval. Do not fabricate either.

```bash
node scripts/tenders.mjs import autorfp --bid="<bid>" --file="<file>" --actor="<actor>" --json
```

Replace placeholders with the actual supplied values. Read-only commands report missing facts as missing. For changes, show the affected record and the result. Nothing here sends, publishes or deletes.
