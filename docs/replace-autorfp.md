# Bring an AutoRFP.ai project across

Source reopened 8 October 2026: [AutoRFP.ai project export and Excel Backup](https://learn.autorfp.ai/en/articles/9563240-how-to-export-projects-and-create-export-templates). The vendor documents project export and Excel Backup. It does not publish a stable backup column schema or a downloadable reference workbook in this article. No customer workbook was available for this build. The included fixture is a fictional normalised example, not a claimed vendor export.

## Export and prepare

1. Open the project in AutoRFP.ai with export permission. Use its Excel Backup export. Retain the original workbook and any attachments separately.
2. Open the sheet containing the requirements and responses. Save that sheet as CSV UTF-8. One row must represent one requirement. Keep multiline answer cells quoted. Export each sheet separately if the workbook splits requirements.
3. Inspect its actual headers. The default mapping expects Requirement and Response, with an optional Section. Rename these headers or pass the header options below. If the sheet supplies stable unique IDs, map its ID column. Never assume the backup has the same columns as our example.
4. Create a fresh DATA_DIR, run npm run migrate without seed, then add-bid with the real customer, owner, deadline and contact-data review. Do not mix demo and customer data.

## One-command import

```bash
npm run tenders -- import autorfp --bid="Our tender" --file=imports/backup.csv --actor="Morgan" --dry-run
npm run tenders -- import autorfp --bid="Our tender" --file=imports/backup.csv --actor="Morgan"
```

The first invocation validates all rows and rolls back. The second commits atomically. Header mapping example:

```bash
npm run tenders -- import autorfp --bid="Our tender" --file=imports/backup.csv --question-column="Question" --answer-column="Answer" --section-column="Topic" --id-column="ID" --actor="Morgan" --dry-run
```

| CSV data | Local field |
|---|---|
| Requirement or selected question column | Requirement text |
| Response or selected answer column | Answer, including blank answers |
| Section or selected section column | Section, blank if absent |
| Selected ID column | Bid-scoped import identity |
| Every original column | source_data for reconciliation |
| Bid owner and deadline | Initial assignment and response due date |

No approval, evidence source or author identity is inferred from vendor content. Imported answers need source references and independent local approval before a bid is ready. Unknown columns stay available in source_data.

Without an ID column, the section and question text together identify a row. Repeat imports of identical data do not duplicate it. Changes to a response clear its approval, evidence reference and library link. With a stable ID, question edits update that record. Without a stable ID, changed section or question text creates a new record. Review such revisions manually. Duplicate identities, malformed rows, missing headers and empty requirements reject the entire file, including earlier valid rows. Removed source rows do not delete local records.

## Reconcile before switching

Compare source and local row counts, spot-check long answers, blank answers and special characters, assign the real owners, record sources and review every imported response. Run submission-readiness, draft a response pack and check it with the bid owner. Keep AutoRFP.ai and the original exports until the business accepts the result. A one-day trial covers this supported question-and-answer import, not every linked system.

This imports one project's response records. It does not clone the content library, connectors, permissions, approvals, embedded images, formulas, attachments, source documents, formatting, portal integrations or original customer workbook layout. Enterprise DNA agrees those mappings and connections as separate migration work. Draft HTML is a review document; a person prepares and submits the customer's required format.

The export command writes a complete private JSON archive of this database's records and change history. It is not a vendor re-import file or an automated, tested disaster-recovery restore. Test database backups separately.
