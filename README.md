# Meet Your Co-Founder 🤝🚀

[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Flask](https://img.shields.io/badge/Backend-Flask-000000?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Supabase](https://img.shields.io/badge/Database-Supabase%20Postgres-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/UI-Tailwind%20v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![FramerMotion](https://img.shields.io/badge/Animations-Framer%20Motion-F107A3?logo=framer&logoColor=white)](https://www.framer.com/motion/)

A high-energy, gamified speed-dating matchmaking platform designed for hackathons, startup accelerators, and networking events to help founders evaluate real co-founder compatibility in real time.



---


## 🛠 Tech Stack

* **Frontend:** React 19, Vite, Tailwind CSS v4, Framer Motion, React Router DOM v6.
* **Backend:** Python, Flask, Flask-SQLAlchemy (ORM), Flask-JWT-Extended (Token Authorization), Flask-CORS.
* **Database:** PostgreSQL (Hosted on Supabase).

---

##  Project Structure

```text
Meet-Your-Co-Founder/
│
├── frontend/                     # React 19 Frontend
│   ├── src/
│   │   ├── components/           # Reusable UI Components
│   │   ├── pages/
│   │   │   ├── landing/          # Welcome & Home Landing Page
│   │   │   ├── auth/             # Login & Register Forms
│   │   │   ├── dashboard/        # Dashboard (Profile, Timer, Swipes)
│   │   │   └── checkin/          # QR code check-in routing
│   │   ├── services/
│   │   │   └── api.js            # API connection layer with Fetch
│   │   ├── App.jsx               # Router & Routes Definitions
│   │   └── main.jsx              # Entrypoint
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                      # Flask Backend API
│   ├── app.py                    # Entrypoint & Blueprint Registrations
│   ├── model.py                  # SQLAlchemy Database Schema
│   ├── admin_auth.py             # Route Authorization Decorator
│   ├── matchmaking.py            # Round-Robin Matchmaking Scheduler
│   ├── start_event_ep.py         # Start Event Endpoint (/start-event)
│   ├── current_round_ep.py       # Active Timers & Transition Logic (/current-round)
│   ├── test_matchmaking.py       # Developer Mock/Speedrun script
│   ├── reset_timer.py            # Utility script to restart active room rounds
│   ├── check_db.py               # Live Database Diagnostic Tool
│   ├── .env                      # Database credentials (Postgres)
│   └── requirements.txt
│
└── README.md
```

---

##  Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) and [Python 3.10+](https://www.python.org/) installed.

### 1. Backend Setup

1. Open your terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file in the `backend/` directory and configure your credentials:
   ```env
   DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/postgres"
   JWT_SECRET_KEY="your-super-secret-key"
   ```
4. Run database setup scripts to create tables (if doing a fresh install):
   ```bash
   python create_all.py
   ```
5. Start the Flask development server:
   ```bash
   python app.py
   ```
   *The backend server will run at `http://127.0.0.1:5000`*

### 2. Frontend Setup

1. Open a new terminal and navigate to the project root directory:
   ```bash
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will run at `http://localhost:5173/`*

---

##  Testing Workflows (Speedrun)

To make it easy to evaluate all matchmaking, real-time timer transitions, and swipe matching mechanics without needing multiple physical devices, use the developer testing suite:

### Step 1: Initialize Multi-Round Matching Data
From your backend terminal, run the matchmaking test script:
```bash
python test_matchmaking.py
```
This script will automatically:
1. Register **4 mock participants** in the database.
2. Check all 4 participants into **Room 1**.
3. Generate a **2-round speed-dating event** scheduling pairings for Room 1.
4. Start the 3-minute timer for **Round 1**.

### Step 2: Log in and Test the Live Timer
1. Open your browser and go to **[http://localhost:5173/auth?tab=login](http://localhost:5173/auth?tab=login)**.
2. Log in using one of the generated test accounts:
   * **Email:** `aarav.sharma@example1.comtest`
   * **Password:** `password`
3. Click the **Live Matching** tab.
4. You will instantly see the circular countdown timer ticking down, your current scheduled opponent's name, and the **Accept** / **Reject** controls!

### Step 3: Swipe and Check Connections
1. Click **Accept** or **Reject** on the match card.
2. Go to the **My Connections** tab. You'll see your swipe recorded with a status badge.
3. If you remain on the Live Matching screen:
   * Once the 3-minute timer hits `0s`, the screen enters a **15-second intermission transition** (*"Please move to your next match"*).
   * It then automatically shifts to **Round 2**, loading a fresh opponent card and resetting the 3-minute timer.

### Step 4: Simulate QR Check-In
To simulate checking in at a physical room door:
1. Sign in to any account.
2. Go directly to: **`http://localhost:5173/checkin?room_id=1`** (or change `1` to `2` or `3`).
3. You will see a success check-in prompt.
4. Verify they are checked in by running the database diagnostic script in the backend terminal:
   ```bash
   python check_db.py
   ```

---
