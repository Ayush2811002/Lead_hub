# LeadHub verification, appointment, and territory workflow

## Outcome
Turn the existing demonstration screens into persisted enterprise workflows for document review, approval, appointment letters, and territory allocation while preserving LeadHub’s current visual system.

## Document verification
- Replace the static verification screen with a live queue filtered by status, document type, reviewer, age, and duplicate risk.
- Add a responsive side-by-side workspace: queue and applicant context, current document preview, prior-version comparison, checklist, comments, and version timeline.
- Group uploaded files into version chains, preserve every prior version, store file hashes, and show uploader/reviewer/timestamps.
- Detect likely duplicate leads from mobile, applicant, outlet, and address signals; show confidence and matched records before a decision.
- Support Verify, Return for correction, and Reject. Correction and rejection require structured reasons and comments.
- Persist each review as a new decision record and append an immutable audit event; never overwrite historical review decisions.

## Approval to appointment letter
- Replace the mock approval board with live eligible applications and gate details.
- Enforce role and separation-of-duties checks on the server and in database policies; the role switcher remains a visual preview only and cannot grant authority.
- Validate required verified documents, completed due diligence, approval state, and live territory capacity in one transaction.
- Record approval/correction/rejection decisions with required reasons and a signer identity, timestamp, and tamper-evident content digest.
- Create or activate the partner only after approval and valid allocation.
- Generate an A4 PDF from an immutable snapshot, store its SHA-256 digest and file reference, and prevent edits after issue.
- Add a public QR verification page that exposes only safe letter validity details.
- Add letter register actions for download, reissue, and revoke. Reissue supersedes the prior letter; revoke requires a reason. Both append lifecycle and audit entries.

## Territory heatmap and allocation
- Upgrade the heatmap to interactive India → state → district → block drill-down with breadcrumbs and selectable rows.
- Show capacity, occupied, reserved, available, utilization, pending leads, and status at every level.
- Add filters and clear capacity warnings for full or overcommitted blocks.
- Add multi-select allocation actions for reserving blocks for a lead or assigning approved blocks to a partner.
- Perform bulk allocation transactionally, reject any full/expired/conflicting selection, update counters/statuses centrally, and append audit entries.
- Keep the reservation list synchronized with bulk allocations, extensions, releases, and expiry.

## Data and security
- Add append-only review, letter lifecycle, and partner-territory records plus additive document/letter metadata needed for versioning and integrity.
- Add database functions for verification decisions, approvals, letter issue/reissue/revoke, reservation, and allocation so validation and audit writes happen atomically.
- Tighten write policies by role and geography scope; block updates/deletes to immutable audit and issued-letter history.
- Use authenticated server functions for protected actions and a narrowly scoped public endpoint/page for QR verification.
- Seed a small realistic workflow dataset because the operational tables are currently empty, enabling immediate review and testing.

## Validation
- Verify permission-denied paths for unauthorized roles and successful paths for verifier, approver, letter issuer, and administrator.
- Exercise correction, rejection, approval, capacity conflict, multi-block reservation/allocation, issue, reissue, revoke, PDF download, and QR verification.
- Confirm stored ownership/actor IDs, immutable audit records, counters, version history, and letter hashes in the database.
- Visually check desktop and mobile layouts, document comparison, long comments/reasons, empty/loading/error states, and generated PDF pages.

## Technical details
- Add one additive database migration; no destructive schema changes.
- Use authenticated TanStack server functions with existing bearer middleware and database RPCs for atomic mutations.
- Use a Worker-compatible PDF library and Lovable Cloud storage; the issued PDF snapshot and digest become immutable evidence.
- Digital signature means authenticated signer identity + signed timestamp + SHA-256 document digest. It is tamper-evident workflow signing, not a third-party certificate-authority signature.
