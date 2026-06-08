## Why

The order model defines five statuses (`pending`, `preparing`, `ready`, `completed`, `cancelled`), but the running application only uses two of them in practice (`pending` and `cancelled`). There is currently no application flow to advance orders through `preparing`, `ready`, and `completed`, so the queue cannot represent real lifecycle progress.

## What Changes

- Add explicit lifecycle transitions for orders: pending -> preparing -> ready -> completed, plus pending -> cancelled.
- Add one status transition API endpoint for forward non-cancel transitions that accepts a requested target status and validates transitions server-side.
- Keep cancellation on the existing `DELETE /api/orders/{id}` operation.
- Enforce transition rules centrally in backend service logic, including keeping cancellation restricted to pending orders only.
- Update the queue UI to show grouped order sections by status, including both completed and cancelled orders.
- Auto-collapse the Completed section by default to reduce queue noise while keeping it expandable.
- Add inline status action controls in the frontend for advancing orders through allowed next states.
- Show clear frontend error messaging when a status update is rejected due to an invalid transition.

## Capabilities

### New Capabilities

- `order-status-lifecycle`: Manual queue progression with validated status transitions and UI controls for pending, preparing, ready, completed, and cancelled behavior.

### Modified Capabilities

_(none)_

## Out of Scope

- Order history persistence or historical reporting beyond the current in-memory queue state.
- Analytics, SLA metrics, or operational dashboards.
- Customer or staff notifications (email, SMS, push, or in-app notification streams).
- Time estimates, ETA predictions, or timing-based workflow automation.

## Impact

- **Backend**: `backend/services/orders.py` transition map and status mutation validation logic.
- **Backend**: `backend/app.py` new order status transition route for non-cancel states, with existing delete-cancel route retained.
- **Frontend**: `frontend/script.js` grouped queue rendering, per-status action buttons, and transition request handling.
- **Frontend**: `frontend/style.css` queue group and action control styling adjustments.
- **API**: Add status transition endpoint for existing order resources while preserving delete cancellation semantics.