## 1. Backend Lifecycle Rules

- [x] 1.1 Add an explicit allowed-transition map in `backend/services/orders.py` for pending, preparing, ready, completed, and cancelled flow.
- [x] 1.2 Implement a service method to transition order status by ID for valid forward non-cancel transitions.
- [x] 1.3 Add not-found handling in the transition service path for unknown order IDs.
- [x] 1.4 Add invalid-transition handling in the transition service path for disallowed state changes.
- [x] 1.5 Ensure existing cancellation behavior remains restricted to pending orders and reuses lifecycle validation.

## 2. API Status Transition Endpoint

- [x] 2.1 Add a request model for forward non-cancel status transition payloads in `backend/models.py` or `backend/app.py` as appropriate.
- [x] 2.2 Add a route in `backend/app.py` for forward status transitions (for example `PATCH /api/orders/{id}/status`) that delegates to `OrderService`.
- [x] 2.3 Preserve and align `DELETE /api/orders/{id}` as the cancellation operation using shared transition validation rules.
- [x] 2.4 Return a clear not-found HTTP error for unknown order IDs.
- [x] 2.5 Return a clear validation HTTP error for unsupported target status values.
- [x] 2.6 Return a clear transition HTTP error for disallowed status changes.

## 3. Frontend Queue Lifecycle UI

- [x] 3.1 Render grouped queue section containers for pending, preparing, ready, completed, and cancelled orders.
- [x] 3.2 Ensure each order is placed under the section matching its current status during refresh.
- [x] 3.3 Add contextual action controls per order card that only expose valid next transitions for the current status.
- [x] 3.4 Implement frontend API call logic for forward status transitions and refresh queue state after success.
- [x] 3.5 Keep cancellation wired to `DELETE /api/orders/{id}` and refresh queue state after success.
- [x] 3.6 Add frontend error handling to display rejected transition messages and reload queue data after failure.
- [x] 3.7 Auto-collapse the Completed section by default and add a toggle to expand/collapse it.

## 4. Styling and Verification

- [x] 4.1 Update `frontend/style.css` for status-group layout.
- [x] 4.2 Add responsive/mobile adjustments for status groups and action controls.
- [x] 4.3 Implement standardized badge classes: `.status-pending`, `.status-preparing`, `.status-ready`, `.status-completed`, and `.status-cancelled`.
- [x] 4.4 Ensure badge colors are visually distinct across pending, preparing, ready, completed, and cancelled statuses.
- [x] 4.5 Manually verify lifecycle paths: pending -> preparing -> ready -> completed and pending -> cancelled.
- [x] 4.6 Manually verify invalid transitions are rejected and surfaced clearly in the UI.
- [x] 4.7 Manually verify Completed section is collapsed by default and expands correctly when toggled.