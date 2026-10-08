# Privacy reminders and response controls

Sources reopened 8 October 2026. This is a general tender response ledger. It does not certify legal compliance, truth of an answer, security controls, ISO 27001 or SOC 2. Review the actual procurement terms and your organisation's obligations before a submission.

## External privacy rules

New Zealand Privacy Act information privacy principle 8 concerns reasonable steps to check accuracy before using or disclosing personal information. [Privacy Commissioner, principle 8](https://www.privacy.org.nz/privacy-principles/8/). Reference names, contact details and staff biographies in bids need checking. The answer source and independent review controls support that review, but cannot inspect a linked document or decide that disclosure is lawful. There is no automatic legal pass for principle 8.

Principle 9 limits retention to the period required for a lawful purpose. [Privacy Commissioner, principle 9](https://www.privacy.org.nz/privacy-principles/9/). IPP9-review flags an absent purpose/retention note or an expired privacy review date. The business chooses the next review date based on the purpose and obligations. The check neither prescribes a retention period nor deletes anything.

The demo's review intervals are internal examples, not legal deadlines. Australian and other jurisdictions need their own reviewed rules. Do not reuse the New Zealand reminders as a declaration of Australian compliance.

## Internal policies

INTERNAL-response-evidence flags blank answers and missing source references. INTERNAL-library-review flags unapproved or expired library entries. These are shipped tender controls, not laws. An expired library answer or a newer library version holds each response using the old reference until refreshed and reviewed. Approvals require a reviewer different from the author.

A supplied actor name does not prove the person's identity. Configure authenticated access, restricted database roles, least privilege, backup encryption and tested recovery before shared business use. Tables use row-level security without public policies and revoke public access. The local owner connection bypasses row-level security. This is a single-business system, not a tenant boundary or a hosted access-control product.

Activity rejects updates and deletes, but a database owner can change those protections. Import source_data preserves all supplied columns, potentially including personal information. Review and minimise exports before loading them. Protect generated HTML, drafts and backups to the same standard as the source records.
