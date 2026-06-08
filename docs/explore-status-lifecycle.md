# Draft Proposal Summary: Order Status Lifecycle

## Problem

The current order flow only uses a partial lifecycle. Orders are created as pending and can be cancelled while pending, but preparing, ready, and completed are not actively driven by UI actions or API transitions. This creates a mismatch between documented status intent and actual operations behavior.

As a result:
- Queue state does not reflect real drink progress from barista start to handoff.
- Status values exist conceptually but are not consistently enforced through transition rules.
- The queue experience lacks clear progression cues for users monitoring order fulfillment.

## Proposed Solution

Implement a full manual order lifecycle in the existing queue interface, backed by a single status transition endpoint and a server-side transition map.

Decisions baked into this draft:
- Status advancement is triggered by inline action buttons on each order in the existing UI.
- No separate staff interface is introduced.
- No automatic timer-based progression is introduced.
- Cancellation remains restricted to orders in pending status only.
- Completed orders remain visible in a dedicated Completed group on the queue board.
- One backend endpoint handles all status updates and validates transitions against an explicit transition map.
- Invalid transition attempts are rejected with clear API errors.

Target lifecycle behavior:
- pending -> preparing -> ready -> completed
- pending -> cancelled

## Scope

In scope for this proposal:
- Define and enforce a transition map for allowed status changes.
- Add one status update API endpoint that accepts requested target status.
- Validate current-to-target transitions in backend service logic.
- Preserve current cancel-from-pending-only rule.
- Update queue UI to show grouped status sections, including Completed.
- Add inline action buttons per order based on current status and allowed next actions.
- Handle invalid transition responses gracefully in the frontend.

## Out of Scope

Not included in this proposal:
- Separate staff or admin dashboard.
- Automatic status progression via timers, jobs, or workflow engines.
- Role-based authorization or authentication changes.
- Database persistence redesign beyond current in-memory lifecycle behavior.
- Historical analytics, SLA metrics, or reporting features.
- Notification channels such as SMS, email, or push.

## Risks

Key risks and considerations:
- Concurrency and stale UI state: multiple users could act on the same order, causing rejected transitions if state changed server-side first.
- UX clarity: inline controls can become crowded if not carefully designed around grouped sections and status badges.
- Error handling quality: weak client handling of transition rejections could confuse users during rapid status changes.
- Policy drift: if future business rules allow cancel from preparing, transition map and UI controls must evolve together to avoid inconsistencies.
- In-memory lifecycle limits: completed history visibility lasts only for process lifetime unless persistence is introduced later.
