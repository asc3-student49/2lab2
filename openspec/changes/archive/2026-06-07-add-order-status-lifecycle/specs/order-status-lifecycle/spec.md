## ADDED Requirements

### Requirement: System SHALL enforce allowed order status transitions
The system MUST validate every requested status change against an explicit transition map. Allowed transitions are `pending -> preparing`, `preparing -> ready`, `ready -> completed`, and `pending -> cancelled`.

#### Scenario: Valid lifecycle progression is accepted
- **WHEN** an order in `pending` is transitioned to `preparing`
- **THEN** the order status is updated to `preparing`

#### Scenario: Invalid transition is rejected
- **WHEN** an order in `pending` is transitioned directly to `completed`
- **THEN** the request is rejected with an error indicating the transition is not allowed

#### Scenario: Cannot advance a cancelled order
- **WHEN** an order in `cancelled` receives a transition request to any other status
- **THEN** the request is rejected and the order remains `cancelled`

#### Scenario: Cannot advance a completed order
- **WHEN** an order in `completed` receives a transition request to any other status
- **THEN** the request is rejected and the order remains `completed`

### Requirement: System SHALL provide a status transition API operation
The API SHALL provide an order status transition operation that accepts an order identifier and target status for forward non-cancel transitions, and SHALL keep cancellation on `DELETE /api/orders/{id}`.

#### Scenario: Transition request returns updated order
- **WHEN** a client submits a valid status transition request for an existing order
- **THEN** the API returns success with the order payload containing the new status

#### Scenario: Unknown order transition request fails
- **WHEN** a client submits a status transition request for a non-existent order ID
- **THEN** the API returns a not-found error

#### Scenario: Unsupported status value is rejected
- **WHEN** a client submits a status transition request with a target status outside the allowed status set
- **THEN** the API returns a validation error

#### Scenario: Cancellation uses delete operation
- **WHEN** a client cancels a pending order using `DELETE /api/orders/{id}`
- **THEN** the API marks the order as `cancelled`

#### Scenario: Delete cancellation rejects non-pending order
- **WHEN** a client calls `DELETE /api/orders/{id}` for an order that is not in `pending`
- **THEN** the API returns an error indicating the order cannot be cancelled

### Requirement: Queue UI SHALL present orders in status groups
The frontend queue board SHALL render orders in grouped sections for `pending`, `preparing`, `ready`, `completed`, and `cancelled`, and SHALL keep completed and cancelled orders visible in the board.

#### Scenario: Completed orders appear in dedicated section
- **WHEN** an order reaches `completed`
- **THEN** the order is rendered under the Completed section of the queue board

#### Scenario: Cancelled orders appear in dedicated section
- **WHEN** an order reaches `cancelled`
- **THEN** the order is rendered under the Cancelled section of the queue board

#### Scenario: Completed section is auto-collapsed
- **WHEN** the queue board renders with one or more completed orders
- **THEN** the Completed section is collapsed by default and indicates it can be expanded

#### Scenario: User can expand completed section
- **WHEN** a user activates the Completed section toggle
- **THEN** the Completed section expands to show completed orders

#### Scenario: Orders are rendered in section matching current status
- **WHEN** queue data is refreshed
- **THEN** each order appears in the section that matches its current status

### Requirement: Queue UI SHALL expose only valid next actions
For each order card, the frontend SHALL show action controls only for transitions allowed from that order's current status.

#### Scenario: Pending order shows start and cancel actions
- **WHEN** an order card is in `pending`
- **THEN** the card shows actions to move to `preparing` and to cancel

#### Scenario: Ready order shows complete action only
- **WHEN** an order card is in `ready`
- **THEN** the card shows an action to move to `completed` and does not show cancel

### Requirement: Status badges SHALL use standardized CSS classes
The frontend SHALL implement status badge styling with the CSS classes `.status-pending`, `.status-preparing`, `.status-ready`, `.status-completed`, and `.status-cancelled`.
Badge colors MUST be visually distinct so `pending`, `preparing`, `ready`, `completed`, and `cancelled` are clearly differentiable at a glance.

#### Scenario: Badge class maps to each status
- **WHEN** an order is rendered with status `pending`, `preparing`, `ready`, `completed`, or `cancelled`
- **THEN** the corresponding badge uses `.status-pending`, `.status-preparing`, `.status-ready`, `.status-completed`, or `.status-cancelled`

#### Scenario: Badge colors are visually distinct by status
- **WHEN** badges for `pending`, `preparing`, `ready`, `completed`, and `cancelled` are displayed together
- **THEN** each status badge color is clearly distinguishable from the others

### Requirement: Frontend SHALL handle rejected transitions with user feedback
If a status transition request is rejected by the server, the frontend MUST show an error message and refresh queue state so the displayed status remains accurate.

#### Scenario: Stale client action receives clear feedback
- **WHEN** a user attempts a transition that has become invalid due to another client updating the order first
- **THEN** the UI displays an error message and refreshes the order list
