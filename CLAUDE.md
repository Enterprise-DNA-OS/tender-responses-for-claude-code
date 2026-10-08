# Tender Responses for Claude Code

A tender response record system for one business. The demo is a fictional Harbour response team. It runs a bid/no-bid review, allocates questions, reuses reviewed answers, routes responses for independent review and prepares a draft response pack.

Every answer starts with the CLI. Never invent a requirement, answer, evidence reference, approval, customer or actor. Read source records before writing. An actor is attribution supplied by the operator, not an authenticated identity. Never manufacture a second identity to pass independent review.

Library revisions clear approval and flag affected tender responses without silently changing their text. Import changes clear approval and evidence references. A submitted bid accepts no answer changes. Recorded activity is append-only. Owners can change the database and its triggers, so this is not a tamper-proof archive.

Read docs/compliance.md before interpreting a check. Privacy review dates are internal reminders, not statutory retention periods. No claims of ISO or SOC certification. Read docs/replace-autorfp.md before import. Local mode supports one process. Shared use requires authenticated operators, restricted database roles and tested backups. Never expose an owner database connection to a browser.

## Recurring jobs

| Job | Recipe |
|---|---|
| List the bid register, customers, owners and deadlines | /bids |
| Review open bids before committing the team | /bid-triage |
| Read the requirements and response state | /requirements |
| Review the reusable answer library | /library |
| Review expired or unapproved library answers | /review-queue |
| Chase responses that are unanswered, unsupported or unapproved | /response-queue |
| Check what holds each bid before submission | /submission-readiness |
| Allocate unfinished questions by owner | /workload |
| Find tenders affected by changed or expired library answers | /reuse-impact |
| Find answers without supporting sources | /missing-sources |
| Find late unfinished questions | /overdue-questions |
| Assign questions that have no owner | /unassigned-questions |
| Review late bids, late responses and library reviews | /attention |
| Review privacy reminders and internal evidence checks | /compliance |
| Read the change history | /activity |
| Read one bid and its complete question list | /bid |
| Read a response and its recorded revisions | /question |
| Read a library answer and its recorded revisions | /entry |
| Search library text before drafting an answer | /search |
| Prepare the Monday bid review from triage, attention and workload | /weekly-review |
| Register a bid with a deadline and contact-data review | /add-bid |
| Add a requirement to an open bid | /add-question |
| Assign a question and an internal deadline | /assign |
| Write a sourced answer and clear its previous approval | /answer |
| Record independent review of the current response | /approve-answer |
| Add a sourced draft answer to the library | /add-entry |
| Revise a library answer and clear its approval | /revise-entry |
| Record independent review of a current library version | /approve-entry |
| Copy a current approved library answer for local bid review | /use-library |
| Record the purpose and next review for bid contact data | /review-data |
| Record a submission that a person has already made | /record-submission |
| Record an award, loss or no-bid decision | /record-outcome |
| Record a bid decision or note | /log |
| Draft a tender response pack for human review | /draft-response |
| Draft a reviewer follow-up without sending | /draft-follow-up |
| Import an AutoRFP.ai backup saved as CSV | /import |
| Export all records and history to private JSON | /export |
| Change fields, rules and documents | /customise |
| Add a read-only report | /new-view |

Use scripts/tenders.mjs, with --json for machines. All runtimes share .claude/commands/. Ambiguous names list candidates and exit 1. Never send, submit to portals, delete, publish or call vendor systems. Drafts stay in drafts/.

Omni by Enterprise DNA installs, customises and runs this system. https://enterprisedna.co/omni/book/?offer=replace-software&utm_campaign=autorfp&utm_source=github&utm_medium=instructions
