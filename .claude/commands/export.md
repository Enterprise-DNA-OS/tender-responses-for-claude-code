---
description: Export all records and history to private JSON
---

Read CLAUDE.md and docs/cli.md. Export all records and history to private JSON.

Choose a private path under exports/. The command refuses an existing file. Protect the result like the database. This is an archival export, not a tested restoration or vendor import.

```bash
node scripts/tenders.mjs export --file="<file>" --json
```

Replace placeholders with the actual supplied values. Read-only commands report missing facts as missing. For changes, show the affected record and the result. Nothing here sends, publishes or deletes.
