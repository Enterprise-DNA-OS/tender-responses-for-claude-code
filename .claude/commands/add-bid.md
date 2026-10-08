---
description: Register a bid with a deadline and contact-data review
---

Read CLAUDE.md and docs/cli.md. Register a bid with a deadline and contact-data review.

Read the relevant records first. Resolve partial names using the CLI. If a lookup is ambiguous, show the candidates and obtain the intended record. Use real evidence and operator-supplied values.

```bash
node scripts/tenders.mjs add-bid --name="<name>" --customer="<customer>" --owner="<owner>" --due="<due>" --privacy-review="<privacy-review>" --retention="<retention>" --actor="<actor>" --json
```

Replace placeholders with the actual supplied values. Read-only commands report missing facts as missing. For changes, show the affected record and the result. Nothing here sends, publishes or deletes.
