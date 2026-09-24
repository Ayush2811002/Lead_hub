# Lead Hub Pro

You are a Senior Product Designer at Stripe + Salesforce + Linear. Design a complete enterprise SaaS web application called LeadHub.

The attached SRS is the functional source of truth. Follow its workflows, roles, lead stages, document verification, territory allocation, appointment letter generation, reporting, and permissions exactly. Do not change the business logic—only create a world-class user experience.

PRODUCT OVERVIEW

LeadHub is a centralized Distributor, Retailer & Customer Service Point (CSP) Lead Management Portal.

The portal manages the complete lifecycle:

Lead Creation

Applicant Profile

Outlet Location & GPS

Document Verification

Due Diligence

Approval Workflow

Territory Allocation

Appointment Letter Generation

Partner Activation

Reports & Analytics

Target users:

Super Admin

State Manager

District Manager

Lead Executive

Verification Officer

Approver / Letter Issuer

Read Only Auditor

This is an enterprise B2B product used by large organizations managing thousands of distributors across India.

DESIGN VISION

Create a premium enterprise interface comparable to:

Salesforce Lightning

Stripe Dashboard

Notion

Linear

Zoho CRM

Atlassian Admin

The design must feel like a ₹20–30 lakh custom SaaS product, not a template.

Design Principles

Minimal

Elegant

Enterprise

Data-first

Professional

Accessible

Responsive

Avoid:

Glassmorphism

Heavy gradients

Neumorphism

Gaming aesthetics

Bright colorful cards

Rounded pills everywhere

Use a clean executive appearance.

COLOR SYSTEM

Token

Value

Primary

#2563EB

Primary Hover

#1D4ED8

Background

#F8FAFC

Surface

#FFFFFF

Secondary Surface

#F1F5F9

Border

#E5E7EB

Text Primary

#111827

Text Secondary

#64748B

Success

#16A34A

Warning

#F59E0B

Error

#DC2626

Info

#0EA5E9

Use color sparingly. Let whitespace dominate.

TYPOGRAPHY

Font: Inter

Hierarchy:

H1 → 32 Bold

H2 → 24 SemiBold

H3 → 20 SemiBold

Title → 18 Medium

Body → 14 Regular

Caption → 12 Regular

Use generous spacing with an 8px spacing system.

GRID & LAYOUT

Desktop: 1440px

Use a 12-column responsive grid.

Structure:

Left collapsible sidebar (280px)

Top navigation (72px)

Main content

Right optional detail drawer

Rounded corners: 16px

Shadow: subtle only.

DESIGN SYSTEM

Create reusable components before screens.

Navigation

Collapsible Sidebar

Nested menu

Active indicator

Organization switcher

User profile

Header

Global search

Notifications

Quick create

User avatar

Breadcrumb

Components

KPI Cards

Statistic Cards

Data Table

Search Input

Multi-select Filters

Status Badges

Chips

Stepper Wizard

Timeline

Tabs

Accordions

File Upload

Image Preview

Map Container

Calendar

Drawer

Modal

Toast

Empty State

Skeleton Loader

Pagination

Everything must be reusable.

SIDEBAR

Design this navigation.

🏠 Dashboard

Lead Management

All Leads

Create Lead

Follow-ups

Verification

Document Review

Due Diligence

Approval Queue

Territory

Coverage Map

Capacity

Partner Directory

Letters

Generate Letter

Letter Register

Reports

Analytics

Audit Log

Administration

Users

Roles

Geography Masters

Banks & Programs

Settings

Icons: Lucide only.

SCREENS TO DESIGN

Design all screens in high fidelity.

1. Login

Modern enterprise login.

Include:

Brand logo

Welcome message

Email

Password

Remember me

Forgot password

Illustration (subtle)

Security footer

2. Forgot Password

OTP-based recovery UI.

3. Dashboard

Executive dashboard with:

Top KPI cards:

Total Leads

Pending Verification

Approved Partners

Vacant Territories

Analytics:

Monthly Lead Trend (Line)

Lead Status Distribution (Donut)

State-wise Coverage

Approval Funnel

Widgets:

Recent Activities

Overdue Follow-ups

Expiring Documents

Pending Approvals

Use beautiful charts.

4. Lead List

Enterprise CRM table.

Columns:

Lead ID

Applicant

Type

Program

Mobile

District

Owner

Status

Follow-up

Actions

Top toolbar:

Search

State

District

Block

Type

Status

Date

Export

Bulk Actions

Sticky table header.

Hover row interaction.

5. Create Lead

Horizontal 5-step wizard.

Step 1

Applicant

Name

Father Name

DOB

Gender

Entity Type

Mobile

Email

Step 2

Residential Address

State

District

Block

Village

PIN

Step 3

Outlet

Shop Name

Outlet Address

GPS Capture

Map Pin

Latitude/Longitude

Exterior Photo

Step 4

Documents

Upload cards:

PAN

Aadhaar

Photograph

Police Verification

Bank Form

Show upload progress.

Step 5

Review

Summary cards.

Validation checklist.

Submit button.

6. Lead Details

Large profile layout.

Header:

Applicant photo

Name

Lead ID

Status

Priority

Owner

Tabs:

Overview

Applicant

Residential

Outlet

Documents

Due Diligence

Follow-ups

Approval

Territory

Letters

Activity

Right side:

Quick actions.

7. Applicant Profile

Beautiful information cards.

Sections:

Personal

Contact

Business

Identity

Consent

8. Residential Address

Address visualization with map preview.

9. Outlet Location

Split layout.

Left:

Form.

Right:

Interactive map.

Include:

GPS button

Accuracy badge

Capture method

Timestamp

10. Document Upload

Grid of document cards.

Each card shows:

Preview

File name

Upload date

Version

Status

Replace

Use drag-and-drop.

11. Document Verification

Verification workspace.

Left:

Document viewer.

Right:

Checklist.

Buttons:

Verify

Reject

Request Correction

Timeline below.

12. Due Diligence

Inspection report UI.

Include:

Infrastructure checklist

Internet

Electricity

Computer

Printer

Biometric

Ownership

Inspector notes

Photos

13. Follow-up Calendar

CRM calendar.

Views:

Day

Week

Month

Cards:

Calls

Visits

Meetings

Floating create button.

14. Activity Timeline

Linear-style timeline.

Show:

Lead created

Documents uploaded

Verification

Approval

Letter issued

Each event has:

User

Time

Description

15. Approval Queue

Kanban layout.

Columns:

Pending

Under Review

Correction

Approved

Opening a card shows a side drawer.

16. Territory Coverage

Executive overview.

Cards:

Open Blocks

Filled

Reserved

Available Capacity

Table below.

17. GIS Territory Map

Beautiful India administrative map.

Interaction:

State → District → Block

Color legend:

Green Vacant

Yellow Reserved

Blue Partial

Red Filled

Right panel:

Territory statistics.

18. Capacity Management

Matrix table.

Columns:

State

District

Block

Capacity

Occupied

Reserved

Available

Editable by admin.

19. Partner Directory

Directory cards + table.

Distributor profile:

Logo

Name

Territory

Retailers

CSP Count

Status

20. Appointment Letter Generator

Premium PDF editor.

Layout:

Left:

Merge fields.

Right:

Live PDF preview.

Buttons:

Preview

Generate

Issue

Download

Include QR verification.

21. Letter Register

Table:

Letter No

Name

Type

Issue Date

Expiry

Status

Status chips:

Issued

Superseded

Revoked

Expired

22. Reports & Analytics

Beautiful BI dashboard.

Charts:

Line

Area

Bar

Pie

Heatmap

Filters:

Date

State

Program

Type

Export modal.

23. Audit Log

Professional activity log.

Columns:

User

Action

Entity

Before

After

Reason

Time

Include diff viewer.

24. User Management

Enterprise user table.

Include:

Invite user

Status

MFA badge

Assigned territory

Role

25. Roles & Permissions

Permission matrix.

Rows:

Modules.

Columns:

Roles.

Checkbox matrix.

Very similar to Notion permissions.

26. Geography Masters

Tree management.

State

→ District

→ Block

CRUD interface.

Import Excel modal.

27. Settings

Sections:

Company Branding

Letter Templates

Reservation Rules

Capacity Rules

Notification Preferences

Security

Backup

MICRO INTERACTIONS

Include:

Hover elevation

Smooth page transitions

Loading skeletons

Animated progress

Success toast

Drag upload animation

Expandable cards

Inline validation

Keep animations subtle (200ms).

STATUS SYSTEM

Design consistent badges.

Draft → Gray

Contacted → Blue

Submitted → Indigo

Verification → Amber

Correction → Orange

Approved → Green

Active → Emerald

Rejected → Red

DATA VISUALIZATION

Use elegant charts.

Need:

Line chart

Area chart

Donut

Stacked bar

Territory heat map

KPI trend indicators

Minimal gridlines.

Professional legends.

RESPONSIVE

Create responsive layouts for:

Desktop 1440

Laptop 1024

Tablet

Mobile field executive

Sidebar becomes drawer.

Tables become cards.

Forms remain usable.

ACCESSIBILITY

WCAG AA colors

Keyboard navigation

Visible focus states

Proper spacing

Large click targets

Screen-reader friendly labels

FINAL OUTPUT

Produce a complete high-fidelity design system and all 27 interconnected screens with consistent components, enterprise UX, realistic CRM data, professional charts, India territory visuals, document workflows, appointment letter preview, and presentation-quality polish.

The result should be indistinguishable from a real production SaaS platform built for a national distributor network.


make very beautifull ui and make it

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3af4e142-8cd5-476e-92de-efcc38fc4c5c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
#   L e a d _ h u b  
 #   L e a d _ h u b  
 