## Context

The BeanBotics frontend currently hardcodes "medium" for every order. Menu cards show only the medium price and render a single "Order (Medium)" button. The backend already accepts any valid size via `POST /api/orders { item_id, size }` and validates it against `menu.json`, which defines small/medium/large with distinct prices for all five drinks. This is a frontend-only change.

## Goals / Non-Goals

**Goals:**

- Let customers choose small, medium, or large before placing an order
- Show per-size pricing so the customer knows the cost before ordering
- Default to medium (preserving current behavior for quick orders)

**Non-Goals:**

- No backend or API changes (already supports all sizes)
- No new drink sizes beyond small/medium/large
- No quantity selector or multi-item cart
- No persistent size preference across page reloads

## Decisions

### 1. Size selector: radio buttons vs. dropdown vs. button group

**Choice:** Radio button group with labels on each menu card, one radio per size.

**Alternatives considered:**
- *Dropdown/select*: Adds a click to reveal options; less visual, harder to show prices inline.
- *Button group*: Simpler styling but less accessible; radio buttons provide native form semantics and keyboard navigation.

**Rationale:** Radio buttons keep all options visible, provide native single-selection behavior, and work well with the existing card layout. Each radio label displays the size name and price.

### 2. State management for selected size

**Choice:** Use the checked radio button's value at order time. The `placeOrder()` function queries `input[name="size-{itemId}"]:checked` to get the selected size.

**Alternatives considered:**
- *Data attributes on the card*: Adds manual state tracking that duplicates what radio buttons provide natively.
- *Global JS object mapping item IDs to sizes*: Unnecessary state management for a simple UI.

**Rationale:** Radio buttons inherently track selection state — no additional JS state management needed. The checked input's `value` attribute gives the size, and its `data-price` attribute gives the price.

### 3. Visual feedback for selected size

**Choice:** CSS styling on the `.size-option` labels with a highlight for the checked radio. The order button price updates dynamically via a `change` event listener on each radio group.

**Rationale:** Immediate visual feedback confirms the selection before the customer commits to ordering. Using event listeners keeps the logic clean without inline onclick handlers.

## Risks / Trade-offs

- **[Wider menu cards]** Three radio options add height/width to each card. → Mitigation: Compact horizontal layout with inline labels; the existing CSS grid with `minmax(260px)` accommodates this.
- **[No size in order display]** The order queue already shows size in the item name (e.g., "Medium Neural Network Latte") because `OrderService.place_order()` builds the display name with `size.capitalize()`. → No additional work needed.
