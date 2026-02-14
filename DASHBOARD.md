# Dashboard Overview

This document describes the role-based dashboard, its current data sources, and how to extend it.

## Location

- `frontend/src/components/Dashboard.tsx`

## Role Groups & Sections

The dashboard renders sections based on the logged-in user’s primary role:

- **Admin**: System Control Center
- **Leadership**: Program Overview
- **Finance**: Finance Snapshot
- **Field**: Field Workspace
- **Report**: Reporting
- **Other**: Generic Workspace

## Current Data Sources

The dashboard uses existing endpoints only (no new APIs were added):

- **Overall statistics**: `GET /api/dashboard/overall`
  - Automatically filters by assigned modules when present.
- **Finance summary**: `GET /api/finance/budget-summary`
  - Finance roles only.
- **Finance approvals**: `GET /api/finance/approvals?status=pending`
  - Finance roles only.
- **Sync status**: `GET /api/dashboard/sync-status`
  - Admin only.

## Data Mapping (Current)

These cards are populated with live data:

- **Leadership / Field / Report / Other**
  - `Active Programs` or `Programs`: `overall.sub_programs`
  - `Activities`: `overall.activities`
- **Finance**
  - `Budget Utilization`: `budget-summary.length` (programs with budgets)
  - `Pending Requests`: `approvals.length`
- **Admin**
  - `Sync & Integrations`: `sync-status.length` (queue items)

All other cards show placeholders (`"-"`) until endpoints are added.

## Extending Metrics

To add a live metric:

1. Add a new endpoint (or reuse an existing one).
2. Fetch it in `Dashboard.tsx` inside the `useEffect`.
3. Bind the response to the appropriate card.

## Notes

- The dashboard layout is ready for customization.
- Module assignments are shown as badges under “Assigned Programs.”
