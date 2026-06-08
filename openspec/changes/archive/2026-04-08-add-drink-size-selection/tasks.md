## 1. Size Selector UI

- [x] 1.1 Add CSS styles for size radio group (`.size-selector`, `.size-option`, `.size-label`, `.size-price`) in `frontend/style.css`
- [x] 1.2 Update `loadMenu()` in `frontend/script.js` to render radio buttons (Small / Medium / Large) with prices inside each menu card
- [x] 1.3 Set medium as the default checked radio and add `change` event listeners to update the order button price

## 2. Size Selection Behavior

- [x] 2.1 Add event listeners on each radio group that update the order button's displayed price when the selection changes
- [x] 2.2 Ensure only one size can be selected per menu card (native radio button behavior)

## 3. Order Placement with Selected Size

- [x] 3.1 Update the order button to show the current price (e.g., "Order — $5.50")
- [x] 3.2 Update `placeOrder()` to read the selected size from the checked radio input instead of hardcoding "medium"

## 4. Verify

- [x] 4.1 Start the app and confirm each menu card shows three size radio options with correct prices from `menu.json`
- [x] 4.2 Confirm selecting a size updates the order button price
- [x] 4.3 Place orders for small and large sizes and verify the order queue shows the correct size name and price
