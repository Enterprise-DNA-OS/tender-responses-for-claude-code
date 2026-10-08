---
description: Prepare the Monday bid review from triage, attention and workload
---

Read CLAUDE.md and docs/cli.md. Prepare the Monday bid review from triage, attention and workload.

Run bid-triage, attention and workload separately, then weekly-review. Present the nearest deadline, response owners, blocked bids and a short list of decisions. Do not infer a bid value or win probability.

```bash
node scripts/tenders.mjs weekly-review --json
```

Replace placeholders with the actual supplied values. Read-only commands report missing facts as missing. For changes, show the affected record and the result. Nothing here sends, publishes or deletes.
