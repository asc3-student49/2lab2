"""
Menu Service

Loads and serves the BeanBotics drink menu from JSON data.
"""

import json
from pathlib import Path
from typing import List, Optional

from backend.models import MenuItem


class MenuService:
    def __init__(self):
        self.items: List[MenuItem] = []
        self._load_menu()

    def _load_menu(self):
        data_file = Path(__file__).parent.parent / "data" / "menu.json"
        with open(data_file, "r") as f:
            menu_data = json.load(f)
        self.items = [MenuItem(**item) for item in menu_data]

    def get_all_items(self) -> List[MenuItem]:
        return self.items

    def get_item_by_id(self, item_id: str) -> Optional[MenuItem]:
        for item in self.items:
            if item.id == item_id:
                return item
        return None
