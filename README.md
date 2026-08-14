# Meet Your Co-Founder — Developer & Testing Guide

Welcome to the development repository for **Meet Your Co-Founder**! This project consists of a **Vite/React frontend** (enhanced with Framer Motion and mobile-first bottom navigation) and a **Flask backend** connected to a **Supabase PostgreSQL database**.

This guide explains how to install dependencies, run the servers, and test all matchmaking, check-in, and swipes workflows locally.

---

## 🚀 Getting Started

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) and [Python 3.10+](https://www.python.org/) installed.

---

### 2. Backend Setup
1. Open a terminal in the `backend` directory:
   ```bash
   cd backend
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file in the `backend/` directory:
   ```env
   DATABASE_URL="---"
   JWT_SECRET_KEY="---"
   ```
4. Start the Flask development server:
   ```bash
   python app.py
   ```
   *The backend will run at `http://127.0.0.1:5000/api`*

---

### 3. Frontend Setup
1. Open a new terminal in the project root directory:
   ```bash
   cd ..
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will run at `http://localhost:5173/`*

---

##  Testing Workflows (Speedrun)

We have created test scripts so you can see the speed-dating matchmaking UI, the timer, and swipe logic immediately without needing to coordinate multiple physical devices.

### Step 1: Initialize Multi-Round Matching Data
From the `backend` folder, run the test matchmaking initialization script:
```bash
cd backend
python test_matchmaking.py
```
This script will:
* Check for or create **4 test participants** (Aaravtest Sharma 1, 2, 3, and 4).
* Set their passwords to `password`.
* Check them into **Room 1**.
* Generate a **2-round speed-dating event** in Room 1.
* Automatically start the 3-minute timer for **Round 1**.

---

### Step 2: Log in and Test the Live Timer
1. Open your browser to **[http://localhost:5173/auth?tab=login](http://localhost:5173/auth?tab=login)**.
2. Log in using the test account:
   * **Email**: `aarav.sharma@example1.comtest`
   * **Password**: `password`
3. Select the **Live Matching** tab from the sidebar (or bottom nav on mobile).
4. You will instantly see the circular countdown timer ticking down from 3:00, your current opponent (**Aaravtest Sharma2**), and the **Accept** / **Reject** swipe controls!

---

### Step 3: Swipe and Check Connections
1. Click **Accept** or **Reject** on the match card.
2. Navigate to the **My Connections** tab. You'll see your match listed with the correct outcome badge.
3. If you remain on the Live Matching screen for the full 3 minutes:
   * The page will enter a **15-second intermission transition** (*"Please move to your next match"*).
   - It will automatically advance to **Round 2** and load a new opponent card with a fresh 3-minute timer!

---

### Step 4: Simulate QR Check-In
To simulate checking in via a physical QR code at a room entrance:
1. Log in to any account.
2. Manually go to this URL in your browser:
   **`http://localhost:5173/checkin?room_id=1`** (or change `1` to `2` or `3`).
3. You will see a check-in success screen.
4. Run `python check_db.py` inside the `backend` folder to verify the participant's `room_id` has been updated in Supabase.

---

### Step 5: Verify the Live Database
Run the database diagnostic tool to print out current participants, rooms, categories, ideas, and swipe statistics:
```bash
cd backend
python check_db.py
```

---

## Technology Stack
* **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion (animations).
* **Backend**: Flask, Flask-SQLAlchemy (PostgreSQL via Supabase), Flask-JWT-Extended (auth).
