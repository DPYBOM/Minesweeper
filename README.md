# Minesweeper Project

A web-based Minesweeper game with Django backend and JavaScript frontend.

## Features

### ✅ Completed

- Singleplayer mode with seed-based board generation
- Safe first-click logic
- Timer
- Tile/flag counter
- User registration & login
- Additional Password validation (OWASP/ISO compliant)

### ⏳ Planned

- Multiplayer mode with asynchronous gameplay
- Multiplayer leaderboard
- Visual Effects

## Tech Stack

- Backend: Django, Python
- Frontend: HTML, CSS, JavaScript

## Setup

1. Clone repository:
   ```bash
   git clone https://github.com/DPYBOM/Minesweeper.git
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. (Optional) Install Node.js dependencies (for frontend testing):
   ```bash
   npm install
   ```
4. Run Django migrations:
   ```bash
   python manage.py migrate
   ```
5. Run the server:
   ```bash
   python manage.py runserver
   ```
