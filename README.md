# BeanBotics

A coffee ordering web application for BeanBotics Corporation — an AI-powered robotic barista company.

## Setup

1. Create and activate a virtual environment:
   ```bash
   uv venv
   ```

2. Install dependencies:
   ```bash
   uv pip install -r requirements.txt
   ```

3. Start the application:
   ```bash
   uv run uvicorn backend.app:app --reload --host 0.0.0.0 --port 8000
   ```

4. Open http://localhost:8000 in your browser.

## What It Does

- View the BeanBotics drink menu (5 AI-themed specialty coffees)
- Place orders (medium size)
- View the order queue
- Cancel pending orders

## Tech Stack

- **Backend:** Python with FastAPI
- **Frontend:** HTML, CSS, vanilla JavaScript
- **Data:** JSON files (no database)
