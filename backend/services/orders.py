"""
Order Service

Manages the BeanBotics order queue — placing, listing, cancelling, and lifecycle transitions.
"""

from typing import Dict, List, Optional, Set

from backend.models import Order
from backend.services.menu import MenuService


class OrderService:
    def __init__(self, menu_service: MenuService):
        self.menu_service = menu_service
        self.orders: List[Order] = []
        self._next_id = 1
        self.allowed_transitions: Dict[str, Set[str]] = {
            "pending": {"preparing", "cancelled"},
            "preparing": {"ready"},
            "ready": {"completed"},
            "completed": set(),
            "cancelled": set(),
        }

    def place_order(self, item_id: str, size: str) -> Optional[Order]:
        item = self.menu_service.get_item_by_id(item_id)
        if not item:
            return None
        if size not in item.sizes:
            return None

        price = item.sizes[size]["price"]
        display_name = f"{size.capitalize()} {item.name}"

        order = Order(
            order_id=self._next_id,
            items=[display_name],
            total_price=price,
            status="pending",
        )
        self.orders.append(order)
        self._next_id += 1
        return order

    def get_all_orders(self) -> List[Order]:
        return self.orders

    def get_order_by_id(self, order_id: int) -> Optional[Order]:
        for order in self.orders:
            if order.order_id == order_id:
                return order
        return None

    def transition_order_status(self, order_id: int, target_status: str) -> Order:
        order = self.get_order_by_id(order_id)
        if not order:
            raise LookupError("Order not found")

        allowed_next = self.allowed_transitions.get(order.status, set())
        if target_status not in allowed_next:
            raise ValueError(
                f"Cannot transition order {order_id} from '{order.status}' to '{target_status}'"
            )

        order.status = target_status
        return order

    def cancel_order(self, order_id: int) -> bool:
        try:
            self.transition_order_status(order_id, "cancelled")
            return True
        except (LookupError, ValueError):
            return False
