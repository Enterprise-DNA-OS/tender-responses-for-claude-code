# Tender Responses for Claude Code

Know which tender is held, which answer needs a source and who must review it. An MIT-licensed database and command set for proposal teams. Works with Claude Code, Codex, OpenCode or Cursor.

| Do it yourself | We customise it | We run it for you |
|---|---|---|
| Free. Try the demo and import a project backup saved as CSV. | Your response fields, review rules, document formats, history and browser forms or different stack if needed. | Installed, connected and operated through Omni by Enterprise DNA. One setup fee, then a retainer. |
| [Quick start](#quick-start) | [Get your version built](https://enterprisedna.co/omni/book/?offer=replace-software&utm_campaign=autorfp&utm_source=github&utm_medium=customise) | [Book a call](https://enterprisedna.co/omni/book/?offer=replace-software&utm_campaign=autorfp&utm_source=github&utm_medium=managed) |

## The Monday tender meeting

Five rituals: decide which bids to pursue, allocate questions, reuse reviewed answers, obtain independent response approval and prepare the submission pack. The fictional Harbour demo contains an overdue questionnaire, an expired continuity answer, an unassigned question and a reference-permission answer awaiting review.

## Quick start

Node 20 or later, on Windows or Linux:

```bash
git clone https://github.com/Enterprise-DNA-OS/tender-responses-for-claude-code.git
cd tender-responses-for-claude-code
npm install
npm run demo
npm test
npm run view
npm run docs
```

PGlite stores the local database under .data/db. DATABASE_URL selects Postgres with verified TLS. Local mode supports one process. Start real records in a fresh DATA_DIR with migrate and no seed. Shared business use needs authenticated operators, restricted database roles and tested backups. Actor names are attribution, not authentication.

There are 38 CLI commands including help, and 39 recurring slash recipes including /customise and /new-view. All accept --json. [Arguments and calculations](docs/cli.md). Ambiguous names list candidates and exit 1.

## What makes a response ready

An answer needs an evidence reference and approval by someone other than its author. The operator verifies the evidence; the software does not open linked documents. Library text is copied into a bid with its version. Changing the library keeps the bid text intact and flags the old reference for renewed review. Editing a response clears its approval. Import changes clear both approval and evidence references.

A bid with missing answers, sources, approvals, current library references or a contact-data review stays held. Ready means ready for human review. Recording submission needs the operator's receipt and closes answer editing. Nothing sends, fills a portal or creates a security certification.

## Ten questions beyond a fixed report

AutoRFP.ai already provides reporting, reviews, content search and an agent connection. These are shipped queries you can change around your own rules, not an unsupported claim that the vendor cannot answer them.

1. Which bids depend on an answer whose library review expired? reuse-impact
2. Who owns the most unfinished responses? workload
3. Which tender has no questions and must stay held? submission-readiness
4. Which answers have no supporting source recorded? missing-sources
5. Which questions are overdue and still unfinished? overdue-questions
6. Which requirements have no assigned owner? unassigned-questions
7. Which library records have never received approval? review-queue
8. What did a response say before the last revision? question
9. Which bids need a contact-data retention review? compliance
10. Which tenders copied an older version of a changed library answer? reuse-impact

## Your first hour: ten things to ask for

1. Put our name, logo and colours on the response pack.
2. Show the nearest tender deadlines and what holds them.
3. Assign the unanswered questions to their real owners.
4. Show which library reviews are overdue.
5. Draft a reviewer follow-up and leave it for me to send.
6. Validate our export headers without saving records.
7. Import the checked mapping into a fresh bid.
8. Record the source for one answer and have a colleague review it.
9. Add our product category with /customise.
10. Add a weekly owner report with /new-view.

## Paperwork and views

brand.json controls the business name, logo path and colours. npm run docs creates a draft response pack, reviewer brief and privacy review sheet for each applicable bid. npm run view creates the bid room and answer-evidence report. /draft-response and /draft-follow-up create uniquely named private HTML drafts. All reports require human review before sharing.

[Record checks](docs/compliance.md) distinguish New Zealand privacy reminders from internal tender controls. [Why no front end](docs/why-no-front-end.md) covers mobile, offline and interactive workflows.

## Move from AutoRFP.ai

[The replacement guide](docs/replace-autorfp.md) covers Excel Backup, saving its question-and-answer sheet as CSV, explicit header mapping, a trial import, repeat-import behaviour and reconciliation. Import is one command after preparing the CSV and registering the bid. No real vendor workbook was available for verification; the fixture is a fictional mapped example. Attachments, approval identities, library connections and the original customer document layout require separate migration work.

## Verification

npm test uses a temporary database and exercises every command, independent approvals, stale library references, submission holds, immutable history, import mapping, rollback, repeat imports, HTML escaping, documents, drafts and exports. The same suite is configured in GitHub Actions for Windows, Linux and Postgres 16. TEST_DATABASE_URL must point to an empty disposable database. [Research and selection](docs/research.md).

MIT licence. Not affiliated with AutoRFP.ai or Anthropic. Hosting and agent usage have separate costs. [Book 30 minutes with Sam](https://enterprisedna.co/omni/book/?offer=replace-software&utm_campaign=autorfp&utm_source=github&utm_medium=readme).
