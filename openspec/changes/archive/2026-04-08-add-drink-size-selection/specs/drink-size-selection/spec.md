## Requirements

### Requirement: Menu cards display size options with prices
Each menu card SHALL display a size selector showing all available sizes (small, medium, large) with their corresponding prices.

#### Scenario: Menu loads with size options visible
- **WHEN** the menu page loads
- **THEN** each menu card displays options for small, medium, and large sizes with the correct price for each

#### Scenario: Prices match menu data
- **WHEN** a menu card renders size options for "Neural Network Latte"
- **THEN** small shows $4.50, medium shows $5.50, and large shows $6.50

### Requirement: Customer can select a drink size
The size selector SHALL allow the customer to choose exactly one size per menu card. Medium SHALL be selected by default.

#### Scenario: Default size is medium
- **WHEN** the menu page loads
- **THEN** each menu card has medium pre-selected as the active size

#### Scenario: Selecting a different size
- **WHEN** the customer selects the "Small" size option on a menu card
- **THEN** the small option becomes active, the previously active option is deactivated, and the order button updates to reflect the small size and price

### Requirement: Order button reflects selected size and price
The order button on each menu card SHALL display the currently selected size name and price.

#### Scenario: Order button shows selected size
- **WHEN** the customer selects "Large" on the "Machine Learning Mocha" card
- **THEN** the order button text reads "Order — $7.00" with the large price

#### Scenario: Order button updates when size changes
- **WHEN** the customer changes selection from large to small on a card
- **THEN** the order button text updates to show the small size price

### Requirement: Order is placed with the selected size
When the customer clicks the order button, the system SHALL send the selected size to the API instead of always sending "medium".

#### Scenario: Placing a small order
- **WHEN** the customer selects "Small" on "Deep Learning Doppio" and clicks the order button
- **THEN** the system sends `POST /api/orders` with `{ "item_id": "deep-doppio", "size": "small" }`
- **THEN** the order queue shows "Small Deep Learning Doppio" at $3.50

#### Scenario: Placing a large order
- **WHEN** the customer selects "Large" on "Transformer Flat White" and clicks the order button
- **THEN** the system sends `POST /api/orders` with `{ "item_id": "transformer-white", "size": "large" }`
- **THEN** the order queue shows "Large Transformer Flat White" at $6.75
