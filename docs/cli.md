# Commands and arguments

Run npm run tenders -- <command>, or node scripts/tenders.mjs <command>. All commands accept --json. Arguments accept --name=value or --name value. Dates must be real YYYY-MM-DD dates. Case-insensitive names and partial IDs resolve to exactly one record or list candidates and exit 1.

| Command | Flags |
|---|---|
| bids | None |
| bid-triage | None |
| requirements | None |
| library | None |
| review-queue | None |
| response-queue | None |
| submission-readiness | None |
| workload | None |
| reuse-impact | None |
| missing-sources | None |
| overdue-questions | None |
| unassigned-questions | None |
| attention | None |
| compliance | None |
| activity | None |
| bid | --bid |
| question | --question |
| entry | --entry |
| search | --text |
| weekly-review | None |
| add-bid | --name, --customer, --owner, --due, --privacy-review, --retention, --actor |
| add-question | --bid, --question, --section, --owner, --due, --actor |
| assign | --question, --owner, --due, --actor |
| answer | --question, --answer, --source, --actor |
| approve-answer | --question, --actor |
| add-entry | --title, --question, --answer, --category, --owner, --source, --review-due, --actor |
| revise-entry | --entry, --answer, --source, --review-due, --actor |
| approve-entry | --entry, --actor |
| use-library | --question, --entry, --actor |
| review-data | --bid, --privacy-review, --retention, --actor |
| record-submission | --bid, --receipt, --actor |
| record-outcome | --bid, --outcome, --note, --actor |
| log | --bid, --note, --actor |
| draft-response | --bid |
| draft-follow-up | --bid |
| import | --bid, --file, --actor, --question-column, --answer-column, --section-column, --id-column, --dry-run |
| export | --file |
| help | None |

All write flags are required except category and section. Import defaults to Requirement, Response and optional Section. Header overrides and id-column are optional. The command is import autorfp, followed by its flags. dry-run is a switch, not a boolean value.

Each operation uses one database transaction. Read commands query stored data and do not call external systems. Mutations capture before and after records in activity. Requirements with no answer, no source, a changed or expired library reference, or no approval hold a bid. A bid with no questions or an overdue contact-data review also stays held. Passing these checks means ready for human review, never automatic submission.

The author and reviewer labels must differ without regard to letter case. These labels are not authentication. A person must verify each source and answer. Direct database writes bypass application-level workflow checks, so production access must go through a controlled operator role and this CLI. Local mode supports one process.

record-submission records a receipt for an external action already taken by the operator and closes response editing. record-outcome accepts won or lost only after submission, or no-bid on an open bid. Record changes for an already submitted tender as a new bid or a separately designed amendment workflow.

Readiness reports evaluate the current library, including references on completed bids. For the state at the time of submission, use the activity history and retained response pack. Export includes every stored record and change but is not an automated restore format.

search performs case-insensitive substring matching, not semantic retrieval. response-queue includes completed bids for historical inspection; workload and overdue-questions cover open bids. review-queue lists unapproved or expired library records. reuse-impact shows every bid using a library answer with the current and copied version.

The ten README questions map directly to these commands. No model service or paid API is called by the CLI.
