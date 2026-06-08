## Context

BeanBotics currently creates orders in `pending` and supports cancellation while pending, but it does not provide a complete progression model for active queue management. The system is a FastAPI backend with in-memory order storage and a vanilla JavaScript frontend that polls and renders queue state.

The change introduces a full manual lifecycle in the existing interface without adding new services or persistence. Because status changes affect backend rules, API shape, and frontend interaction patterns, this is a cross-cutting update that benefits from explicit design decisions.

## Goals / Non-Goals

**Goals:**

- Define and enforce allowed order status transitions in one backend source of truth.
- Provide clear API operations for lifecycle updates: forward transitions via status endpoint and cancellation via existing delete endpoint.
- Expose lifecycle progression in the existing queue UI using contextual action buttons.
- Keep completed and cancelled orders visible in dedicated queue sections for immediate operational visibility.
- Reduce queue noise by auto-collapsing the Completed section while allowing expansion on demand.
- Standardize status badge CSS class names and ensure each lifecycle status is visually distinct.

**Non-Goals:**

- No auto-progression via timers, workers, or event-driven workflows.
- No authentication, roles, or separate staff-only interface.
- No database migration; orders remain in memory.
- No notifications, analytics, or historical reporting features.

## Decisions

### 1. Centralize lifecycle rules in `OrderService`

**Choice:** Define an explicit transition map in `backend/services/orders.py` and validate every status mutation through a single service method.

**Alternatives considered:**
- Scatter validation in route handlers: faster initially but risks rule drift between endpoints.
- Infer next status implicitly in frontend only: not safe because server remains authoritative.

**Rationale:** A central transition map keeps rules coherent, testable, and reusable if more clients are added later.

### 2. Use PATCH for forward transitions and DELETE for cancellation

**Choice:** Add an endpoint such as `PATCH /api/orders/{id}/status` for forward non-cancel transitions (`preparing`, `ready`, `completed`) and keep `DELETE /api/orders/{id}` for cancellation (`pending -> cancelled`).

**Alternatives considered:**
- Multiple action-specific endpoints (`/start`, `/ready`, `/complete`): more route surface and duplicated logic.
- Move cancellation into PATCH and deprecate DELETE now: possible, but unnecessary churn because DELETE cancellation is already in use.

**Rationale:** This preserves existing client behavior for cancellation while introducing a concise status endpoint for forward progression. Both operations still delegate to one backend lifecycle rule source.

### 3. Keep cancellation policy strict

**Choice:** Preserve the current business rule that only pending orders may be cancelled.

**Alternatives considered:**
- Allow cancel during preparing: may be desirable later, but changes current operational expectation.

**Rationale:** Retaining existing policy minimizes behavioral surprise and keeps this change focused on introducing lifecycle progression.

### 4. Render queue by status groups with contextual controls

**Choice:** In `frontend/script.js`, group orders into pending, preparing, ready, completed, and cancelled sections, and show only the next valid action button(s) for each order status.

**Alternatives considered:**
- Keep one flat list with status badges only: does not improve operational scanning.
- Add a separate admin page: out of scope and increases complexity.

**Rationale:** Grouping plus inline next-action controls gives clear workflow visibility and low-friction updates in the existing UI.

### 5. Standardize badge class mapping and visual distinction

**Choice:** Use fixed badge class names mapped to each status (`.status-pending`, `.status-preparing`, `.status-ready`, `.status-completed`, `.status-cancelled`) and assign distinct colors per status.

**Alternatives considered:**
- Free-form class naming by component: increases drift risk between script and styles.
- Reusing one badge style with text-only differentiation: weaker scanability in queue operations.

**Rationale:** Stable class contracts improve maintainability and testing, while distinct colors improve at-a-glance status recognition.

### 6. Auto-collapse Completed section with manual expand/collapse control

**Choice:** Render the Completed group collapsed by default and provide a visible toggle to expand or collapse it.

**Alternatives considered:**
- Keep Completed always expanded: simpler but increases board noise as fulfilled orders accumulate.
- Hide Completed entirely after a delay: reduces clutter but removes immediate visibility.

**Rationale:** Default collapse balances operational focus and access to recently completed orders without removing information.

## Risks / Trade-offs

- **[Concurrent updates from multiple clients]** One client may transition an order first, causing another client request to fail as invalid. -> Mitigation: return deterministic 4xx errors and refresh queue state after failed updates.
- **[UI density from added controls]** Extra buttons can clutter cards in narrow layouts. -> Mitigation: show only context-specific actions and keep controls compact.
- **[In-memory lifecycle history is ephemeral]** Completed/cancelled visibility is lost on restart. -> Mitigation: document as current limitation and defer persistence to future change.

## Migration Plan

1. Implement backend transition map and service transition method.
2. Add and wire status transition endpoint in FastAPI routes.
3. Keep and align existing delete-cancel route behavior with shared transition validation.
4. Update frontend queue rendering to grouped sections and status action controls.
5. Verify valid and invalid transitions through API and UI flows.
6. Deploy with no data migration needed; rollback by reverting route/UI changes and service transition map.

## Open Questions

_(none)_