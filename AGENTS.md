# Beanbotics Project Context

## Project Overview

BeanBotics is an AI-themed coffee ordering web application. Customers browse a menu of specialty drinks, select a size, and place orders.

## Tech Stack

- **Backend:** Python 3.10+, FastAPI, Uvicorn
- **Frontend:** Vanilla HTML, CSS, JavaScript (no frameworks)
- **Data:** Menu loaded from `backend/data/menu.json`. Orders stored in memory (no database).

## Project Structure

```
beanbotics/
├── backend/
│   ├── app.py              # FastAPI routes
│   ├── models.py           # MenuItem, Order dataclasses
│   ├── services/
│   │   ├── menu.py         # MenuService — loads menu from JSON
│   │   └── orders.py       # OrderService — manages order queue
│   └── data/
│       └── menu.json       # Drink menu with sizes and pricing
├── frontend/
│   ├── index.html          # Single-page app shell
│   ├── script.js           # UI logic — menu display, order placement
│   └── style.css           # Dark theme styling
├── requirements.txt
```

## API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/menu` | List all menu items with sizes and prices |
| POST | `/api/orders` | Place an order (`item_id`, `size`) |
| GET | `/api/orders` | List all active orders |
| DELETE | `/api/orders/{id}` | Cancel a pending order |

## Conventions

- Backend uses a service layer pattern — routes in `app.py` delegate to service classes.
- Frontend uses vanilla `fetch()` for all API calls. No build step.
- Run the app with `uv run uvicorn backend.app:app --reload --host 0.0.0.0 --port 8000` from the project root (cross-platform; uv handles the venv).
