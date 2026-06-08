## Why

Customers can only order medium-sized drinks. The menu data already defines small, medium, and large sizes with distinct pricing, but the frontend hardcodes "medium" — so customers have no way to choose a different size. This limits order flexibility and leaves existing backend capability unused.

## What Changes

- Add size selection UI to each menu card so customers can pick small, medium, or large before ordering
- Display per-size pricing on menu cards instead of showing only the medium price
- Pass the selected size through to the order API instead of hardcoding "medium"

## Capabilities

### New Capabilities

- `drink-size-selection`: Frontend size picker that lets customers choose small, medium, or large for any drink and see the corresponding price before ordering

### Modified Capabilities

_(none — the backend already accepts and validates any size; no API or data changes needed)_

## Impact

- **Frontend**: `script.js` — menu card rendering, `placeOrder()` function signature and request body
- **Frontend**: `style.css` — styling for size selection controls within menu cards
- **Frontend**: `index.html` — no structural changes expected (dynamic rendering handles it)
- **Backend**: No changes required — `POST /api/orders` already accepts `{ item_id, size }` and validates against the menu
