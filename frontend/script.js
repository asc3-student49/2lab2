const API = "";
let completedExpanded = false;

const STATUS_ORDER = [
    "pending",
    "preparing",
    "ready",
    "completed",
    "cancelled",
];

const STATUS_LABELS = {
    pending: "Pending",
    preparing: "Preparing",
    ready: "Ready",
    completed: "Completed",
    cancelled: "Cancelled",
};

const STATUS_ACTIONS = {
    pending: [
        { label: "Start", type: "transition", target: "preparing", className: "status-action" },
        { label: "Cancel", type: "cancel", className: "status-action cancel-action" },
    ],
    preparing: [
        { label: "Mark Ready", type: "transition", target: "ready", className: "status-action" },
    ],
    ready: [
        { label: "Complete", type: "transition", target: "completed", className: "status-action" },
    ],
    completed: [],
    cancelled: [],
};

async function loadMenu() {
    const container = document.getElementById("menu-list");
    try {
        const res = await fetch(`${API}/api/menu`);
        const data = await res.json();
        container.innerHTML = "";

        data.items.forEach((item) => {
            const card = document.createElement("div");
            card.className = "menu-card";

            const sizesHtml = Object.entries(item.sizes)
                .map(
                    ([size, info]) =>
                        `<label class="size-option">
                            <input type="radio" name="size-${item.id}" value="${size}"
                                data-price="${info.price}"
                                ${size === "medium" ? "checked" : ""}>
                            <span class="size-label">${size.charAt(0).toUpperCase() + size.slice(1)}</span>
                            <span class="size-price">$${info.price.toFixed(2)}</span>
                        </label>`
                )
                .join("");

            const defaultPrice = item.sizes.medium
                ? item.sizes.medium.price.toFixed(2)
                : Object.values(item.sizes)[0].price.toFixed(2);

            card.innerHTML = `
                <h3>${item.name}</h3>
                <p class="description">${item.description}</p>
                <div class="size-selector">
                    ${sizesHtml}
                </div>
                <button class="order-btn" onclick="placeOrder('${item.id}')">
                    Order — $<span id="price-${item.id}">${defaultPrice}</span>
                </button>
            `;
            container.appendChild(card);

            // Update displayed price when size selection changes
            card.querySelectorAll(`input[name="size-${item.id}"]`).forEach(
                (radio) => {
                    radio.addEventListener("change", () => {
                        const priceSpan = document.getElementById(
                            `price-${item.id}`
                        );
                        priceSpan.textContent =
                            parseFloat(radio.dataset.price).toFixed(2);
                    });
                }
            );
        });
    } catch (err) {
        container.innerHTML = `<p class="empty-state">Failed to load menu.</p>`;
    }
}

async function placeOrder(itemId) {
    const selectedRadio = document.querySelector(
        `input[name="size-${itemId}"]:checked`
    );
    const size = selectedRadio ? selectedRadio.value : "medium";

    try {
        const res = await fetch(`${API}/api/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ item_id: itemId, size: size }),
        });
        if (!res.ok) throw new Error("Order failed");
        await loadOrders();
    } catch (err) {
        alert("Failed to place order: " + err.message);
    }
}

async function transitionOrder(orderId, status) {
    try {
        const res = await fetch(`${API}/api/orders/${orderId}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        if (!res.ok) {
            const err = await readApiError(res, "Status update failed");
            throw new Error(err);
        }
        await loadOrders();
    } catch (err) {
        renderQueueError(`Failed to update order: ${err.message}`);
    }
}

async function cancelOrder(orderId) {
    try {
        const res = await fetch(`${API}/api/orders/${orderId}`, {
            method: "DELETE",
        });
        if (!res.ok) {
            const err = await readApiError(res, "Cancel failed");
            throw new Error(err);
        }
        await loadOrders();
    } catch (err) {
        renderQueueError(`Failed to cancel order: ${err.message}`);
    }
}

async function readApiError(res, fallback) {
    try {
        const data = await res.json();
        if (data && data.detail) return data.detail;
    } catch (e) {
        // ignore parse errors and fall back to default message
    }
    return fallback;
}

function renderQueueError(message) {
    const container = document.getElementById("orders-list");
    const existing = container.querySelector(".queue-error");
    if (existing) {
        existing.textContent = message;
        return;
    }
    const errorNode = document.createElement("p");
    errorNode.className = "queue-error";
    errorNode.textContent = message;
    container.prepend(errorNode);
}

function buildOrderCard(order) {
    const card = document.createElement("div");
    card.className = "order-item";

    const info = document.createElement("div");
    info.className = "order-info";
    info.innerHTML = `
        <span class="order-id">#${order.order_id}</span>
        <span class="order-items">${order.items.join(", ")}</span>
        <span class="order-price">$${order.total_price.toFixed(2)}</span>
    `;

    const statusBadge = document.createElement("span");
    statusBadge.className = `order-status status-${order.status}`;
    statusBadge.textContent = STATUS_LABELS[order.status] || order.status;

    const actions = document.createElement("div");
    actions.className = "order-actions";

    (STATUS_ACTIONS[order.status] || []).forEach((action) => {
        const button = document.createElement("button");
        button.className = action.className;
        button.textContent = action.label;
        button.addEventListener("click", async () => {
            if (action.type === "transition") {
                await transitionOrder(order.order_id, action.target);
                return;
            }
            await cancelOrder(order.order_id);
        });
        actions.appendChild(button);
    });

    card.appendChild(info);
    card.appendChild(statusBadge);
    card.appendChild(actions);
    return card;
}

function buildStatusSection(status, orders) {
    const section = document.createElement("section");
    section.className = "queue-group";
    section.dataset.status = status;

    const title = document.createElement("h3");
    title.className = "queue-group-title";
    title.textContent = `${STATUS_LABELS[status]} (${orders.length})`;

    const body = document.createElement("div");
    body.className = "queue-group-body";

    if (status === "completed") {
        const toggle = document.createElement("button");
        toggle.className = "queue-toggle";
        toggle.textContent = completedExpanded ? "Hide Completed" : "Show Completed";
        toggle.addEventListener("click", () => {
            completedExpanded = !completedExpanded;
            loadOrders();
        });
        section.appendChild(toggle);
        if (!completedExpanded) {
            body.classList.add("collapsed");
        }
    }

    if (orders.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-state";
        empty.textContent = "No orders in this status.";
        body.appendChild(empty);
    } else {
        orders.forEach((order) => body.appendChild(buildOrderCard(order)));
    }

    section.appendChild(title);
    section.appendChild(body);
    return section;
}

async function loadOrders() {
    const container = document.getElementById("orders-list");
    try {
        const res = await fetch(`${API}/api/orders`);
        const data = await res.json();

        if (data.orders.length === 0) {
            container.innerHTML = `<p class="empty-state">No orders yet. Pick a drink from the menu!</p>`;
            return;
        }

        container.innerHTML = "";

        const grouped = {
            pending: [],
            preparing: [],
            ready: [],
            completed: [],
            cancelled: [],
        };

        data.orders.forEach((order) => {
            if (!grouped[order.status]) {
                grouped[order.status] = [];
            }
            grouped[order.status].push(order);
        });

        STATUS_ORDER.forEach((status) => {
            container.appendChild(buildStatusSection(status, grouped[status] || []));
        });
    } catch (err) {
        container.innerHTML = `<p class="empty-state">Failed to load orders.</p>`;
    }
}

// Load on page ready
document.addEventListener("DOMContentLoaded", () => {
    loadMenu();
    loadOrders();
});
