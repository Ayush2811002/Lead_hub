# LeadHub Enterprise Portal

## Goal
Build a polished, responsive enterprise lead-management application that demonstrates the complete Distributor, Retailer, and CSP lifecycle from lead capture through activation. The SRS remains the functional source of truth; the first implementation will be a high-fidelity interactive frontend using realistic fictional Indian CRM data, with clear states, permissions, validations, and workflow gates.

## Experience architecture
- Create a shared application shell with a 280px collapsible sidebar, 72px top bar, breadcrumbs, global search, notifications, quick-create menu, organization switcher, and user profile.
- Use dedicated, shareable routes for all major areas: dashboard, leads, create lead, lead details and its workflows, follow-ups, verification, approval queue, territory coverage/map/capacity, partners, letter generator/register, reports, audit log, users, roles, geography, banks/programs, and settings.
- Include dedicated login and OTP recovery screens with an enterprise security treatment.
- Make navigation and actions role-aware in the interface, including explicit restrictions for territory scope, document access, exports, approvals, letter issue, and capacity changes.

## Visual system
- Implement the supplied palette exactly through semantic design tokens: blue primary, cool white/slate surfaces, restrained green/amber/red/info states, subtle borders, and whitespace-led hierarchy.
- Use Inter with the requested 32/24/20/18/14/12 hierarchy and an 8px spacing rhythm.
- Use 16px panel corners, restrained shadows, minimal gridlines, visible focus rings, and 200ms motion.
- Avoid gradients, glass effects, decorative color blocks, excessive pills, and nested cards.
- Create reusable controls for buttons, inputs, selects, badges, tabs, filters, tables, pagination, dialogs, drawers, upload zones, steppers, timelines, empty/loading states, and toasts.

## Core workflow screens
- Dashboard with KPIs, trend indicators, lead trend, status donut, state coverage, approval funnel, activity, follow-ups, document expiry, and approvals.
- Lead register with sticky columns/header, multi-filter toolbar, bulk actions, export, realistic masked data, responsive card mode, and row actions.
- Five-step create-lead wizard covering applicant, residential address, outlet/GPS, versioned documents, and review. Show required-stage gates, duplicate warnings, inline validation, draft state, upload progress, and submission checklist.
- Lead profile with photo, identity, type/program, owner, priority and status; full tab set for overview, applicant, residential, outlet, documents, due diligence, follow-ups, approval, territory, letters, and activity; quick actions sit in a responsive detail rail.
- Document upload and verification workspaces with preview, exact-version review, checklist status, correction request, rejection reasons, replacement history, and audit timeline.
- Due diligence inspection with Yes/No/Not Applicable controls, infrastructure evidence, notes, photos, ownership, and decision summary.
- Follow-up calendar and Linear-style activity history for calls, visits, meetings, verification, decisions, allocation, letter issue, and activation.
- Approval queue with Pending, Under Review, Correction, and Approved columns plus a decision drawer that displays unmet gates and creator/approver separation.

## Territory, partners, and letters
- Territory overview with open, filled, reserved, and available capacity; drill-down table showing occupied/reserved/available independently.
- India territory map experience with State → District → Block drill-down, restrained status legend, map selection, and a statistics panel.
- Capacity matrix that supports admin edit states while preserving the distinction between distributor slots and unlimited Retailer/CSP capacity.
- Partner directory in card/table modes with territory, parent mapping, retailer/CSP counts, lifecycle status, activation date, and partner codes.
- Appointment letter workspace with approved template selection, merge-field validation, premium live document preview, draft watermark, QR verification block, and Preview/Generate/Issue/Download actions.
- Letter register with Draft, Issued, Superseded, Revoked, and Expired history and linked versions.

## Reporting and administration
- BI-style analytics with line, area, bar, donut/pie, funnel, heatmap, date basis, denominators, filters, legends, and export dialog.
- Audit log with actor, action, entity, permitted before/after diff, reason, time, and sensitive-data-safe presentation.
- User administration with invite flow, role, MFA, assigned territory, active/inactive state, and reassignment warning.
- Notion-style role permission matrix with module/action granularity and separate controls for identity data, documents, exports, letters, and capacity.
- Geography master tree for State → District → Block, effective status/history, CRUD controls, and Excel import preview.
- Settings for branding, approved letter templates, reservation/capacity rules, notifications, security, and backup targets.
- Banks & Programs management to support the SRS requirement for configurable master records rather than hard-coded institutions.

## Interaction and responsive behavior
- Make primary navigation, filters, tabs, drawers, dialogs, wizard progression, table/card switching, calendar views, approval cards, document review, and letter preview interactive.
- Use polished loading skeletons, upload/progress motion, success toasts, empty states, inline validation, and keyboard-visible controls.
- At laptop/tablet widths, collapse supporting rails and simplify density; on mobile, use a navigation drawer, stacked forms, touch-sized actions, card-based records, and field-executive-friendly GPS/document flows.
- Preserve WCAG AA contrast, semantic labels, keyboard navigation, and reduced-motion preferences.

## Technical approach
- Keep TanStack Start routing and build each major screen as a real route with unique metadata.
- Use a shared typed mock-data layer for leads, stages, documents, territories, users, events, and reports so every screen tells one consistent story.
- Use Recharts for accessible charts and Lucide for all interface icons.
- Keep this delivery frontend-only: actions will demonstrate production behavior and states but will not persist across sessions or enforce server-side permissions until Lovable Cloud is enabled in a later implementation phase.
- Validate the finished experience at desktop and mobile widths, including navigation, overflow, dialogs/drawers, charts, and all critical workflows.
