---
description: Record independent review of the current response
---

Read CLAUDE.md and docs/cli.md. Record independent review of the current response.

Read question and its sources first. The reviewer must differ from the recorded author. Ask the actual operator to identify the reviewer; never create another actor name to pass the rule. Approval covers the current version only.

```bash
node scripts/tenders.mjs approve-answer --question="<question>" --actor="<actor>" --json
```

Replace placeholders with the actual supplied values. Read-only commands report missing facts as missing. For changes, show the affected record and the result. Nothing here sends, publishes or deletes.
