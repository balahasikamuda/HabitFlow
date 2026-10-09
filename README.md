# HabitFlow – Habit Tracking Application

> **College Hackathon Topic:** Lifestyle & Personal Management – 13. Habit Tracking Application  
> **Tech Stack:** MERN Stack (MongoDB, Express.js, React.js, Node.js) + Tailwind CSS + JWT Authentication

---

## 📌 Problem Statement Overview

Build a modern, full-stack **MERN-based habit tracking application** that tracks daily habits and progress.

The system manages the core relationship:
$$\text{Habit} \longrightarrow \text{Date} \longrightarrow \text{Target} \longrightarrow \text{Completion Status}$$

backed by MongoDB database persistence, Node/Express RESTful APIs, and an interactive React interface.

---

## 🚀 Key Features

### 1. Core CRUD Operations (MongoDB)
* **CREATE:** Add new habits with habit name, scheduled date, target (e.g., 30 minutes, 2 hours), and status (Pending / Completed).
* **READ:** View today's habits, search and filter all personal habits in table or card views.
* **UPDATE:** Modify habit details, numerical progress, and completion status.
* **DELETE:** Remove habits with a confirmation safety modal.

### 2. Hackathon Extra Features
* 🔥 **Habit Streaks:** Automatically tracks consecutive completed days with **Current Streak** and **Best Streak** metrics.
* 📅 **Interactive Calendar:** Visual monthly calendar showing completed, partial, and pending days with date-specific habit drill-down.
* 📊 **Weekly & Monthly Analytics:** Dynamic completion rate percentages, day-by-day weekly completion charts, and category breakdowns.
* 📈 **Live Progress Tracking:** Increment/decrement progress units (minutes, glasses, pages) with celebration confetti on completion.
* 🔔 **Daily Reminders:** Configurable daily notification time settings.
* 👤 **Profile & Statistics:** Account profile details and personal consistency stats.
* ⚙️ **Settings & Session:** Dark/Light mode toggle, reminder preferences, and secure logout.
* 🌙 **Dark/Light Mode:** Seamless full-app theme switching persisted in `localStorage`.
* 🔎 **Search & Filter:** Instant search by habit name, filter by completion status (All/Completed/Pending), category, and date.
* 📱 **Fully Responsive:** Fluid layouts designed for Mobile, Tablet, Laptop, and Desktop screens.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | React 19 + Vite | Component-based, responsive UI |
| **Styling** | Tailwind CSS + Lucide Icons | Clean modern design, animations & dark mode |
| **Backend** | Node.js + Express.js | Modular RESTful API server |
| **Database** | MongoDB + Mongoose | Document database with user-scoped habits |
| **Authentication** | JWT + bcryptjs | Secure password hashing & protected routes |

---

## 📂 Project Structure

```text
HabitFlow/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, Profile & Settings
│   │   └── habitController.js    # CRUD, Streaks, Calendar & Analytics
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT Bearer token protection
│   ├── models/
│   │   ├── Habit.js              # Habit, Date, Target, Status, Streaks, History
│   │   └── User.js               # Name, Email, Password, Role, Settings
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth endpoints
│   │   └── habitRoutes.js        # /api/habits endpoints
│   ├── .env                      # Environment configuration
│   ├── .env.example              # Template environment file
│   ├── seed-user.js              # Pre-seeds demo user & realistic habits
│   ├── test-api.js               # Automated 11-step REST API test suite
│   ├── server.js                 # Express application entrypoint
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── HackathonBanner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── HabitCard.jsx
│   │   │   ├── HabitModal.jsx    # Add & Edit modal
│   │   │   └── DeleteModal.jsx   # Delete confirmation modal
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Authentication state & JWT handling
│   │   │   ├── ThemeContext.jsx  # Dark / Light theme toggle
│   │   │   └── ToastContext.jsx  # Animated toast notifications
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx   # Showcase & features
│   │   │   ├── LoginPage.jsx     # Login with 1-click Demo Fill
│   │   │   ├── RegisterPage.jsx  # New user registration
│   │   │   ├── DashboardPage.jsx # Summary cards, Today's Habits & Streaks
│   │   │   ├── MyHabitsPage.jsx  # Required CRUD Table + Search/Filter
│   │   │   ├── HabitDetailsPage.jsx # Streak info & history timeline
│   │   │   ├── CalendarPage.jsx  # Monthly calendar drill-down
│   │   │   ├── AnalyticsPage.jsx # Progress charts & metrics
│   │   │   ├── ProfilePage.jsx   # User stats & profile update
│   │   │   └── SettingsPage.jsx  # Reminders, themes & logout
│   │   ├── services/
│   │   │   └── api.js            # Axios client with JWT interceptor
│   │   ├── App.jsx               # Routes & protected layouts
│   │   ├── index.css             # Tailwind setup
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── package.json                  # Root scripts with concurrently
└── README.md
```

---

## ⚙️ Installation & Setup Instructions

### Prerequisites
* **Node.js** (v18 or higher)
* **MongoDB** installed locally (running on default port `27017`) or a free MongoDB Atlas connection string.

### 1. Clone / Open Directory
```bash
cd HabitFlow
```

### 2. Install Dependencies
```bash
# Install root, backend, and frontend dependencies
npm run install:all
```
*(Or install individually: `cd backend && npm install` then `cd ../frontend && npm install`)*

---

## 🏃 Run Commands

### Run Everything Concurrently (Recommended)
From the root `HabitFlow` directory:
```bash
npm run dev
```
* **Frontend:** `http://localhost:5173`
* **Backend:** `http://localhost:5000`

### Or Run in Separate Terminals:
**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

---

## 🧪 Testing & Seeding Demo Data

### 1. Seed Demo Account (Instant Hackathon Evaluation)
To populate a pre-configured test user with 5 realistic habits, 7-day completion histories, streaks, and calendar data:
```bash
npm run seed
```
**Demo Credentials:**
* **Email:** `demo@habitflow.com`
* **Password:** `password123`
*(A 1-click "Auto-fill Demo" button is also provided directly on the Login page).*

### 2. Run Automated API Tests
To execute the automated 11-step REST API verification suite (register, login, CRUD operations, streak calculations, toggle, progress, calendar, delete):
```bash
npm test
```

---

## 📋 Complete Hackathon Demonstration Walkthrough

Follow these 10 steps to demonstrate the full application to judges:

1. **Step 1 – Landing Page:** Open `http://localhost:5173`. Highlight the branding, problem statement information banner, architecture pills, and features.
2. **Step 2 – Register / Login:** Click **Login** and use the **Auto-fill Demo** button (or create a brand new account via **Register**).
3. **Step 3 – Dashboard:** View Summary Cards (*Total Habits*, *Today's Habits*, *Completed Habits*, *Pending Habits*) and the *Habit Streaks Tracker* banner.
4. **Step 4 – Create Habit (CRUD - CREATE):** Click **Add Habit**. Fill in:
   * **Habit:** `Study`
   * **Date:** `2026-10-09` (today)
   * **Target:** `2 hours`
   * **Status:** `Pending`
   Click **Create Habit** to save to MongoDB.
5. **Step 5 – Read Habit (CRUD - READ):** View the newly added habit under Today's Habits on the Dashboard or in the **My Habits** table.
6. **Step 6 – Mark Complete & Progress (CRUD - UPDATE):** Click **Mark Completed** or increment the progress counter. Experience celebratory confetti, status badge update to **Completed**, and streak increment.
7. **Step 7 – Inspect Habit Details:** Click on the habit card/row to open **Habit Details**. View the *Active Streak*, *Personal Best Streak*, and the date-by-date *Habit History Logs*.
8. **Step 8 – Calendar View:** Navigate to **Calendar**. View the color-coded monthly calendar. Click on today's date to see the day's completed and pending habits.
9. **Step 9 – Analytics & Progress Charts:** Open **Analytics**. Observe the **Weekly Completion Chart**, overall completion percentage, status comparison, and category performance.
10. **Step 10 – Edit & Delete (CRUD - UPDATE & DELETE):** Go to **My Habits**, edit the habit target, then click **Delete**, confirm the safety modal, and verify the habit is removed from MongoDB.

---

## 📡 REST API Reference

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Login and obtain JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes (Bearer Token) |
| `PUT` | `/api/auth/profile` | Update name, email, or password | Yes |
| `PUT` | `/api/auth/settings` | Update reminder time & theme preference | Yes |

### Habit CRUD & Tracking Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/habits` | **Create** new habit record in MongoDB | Yes |
| `GET` | `/api/habits` | **Read** all habits (with search & filter params) | Yes |
| `GET` | `/api/habits/:id` | **Read** single habit with history & streaks | Yes |
| `PUT` | `/api/habits/:id` | **Update** habit fields (name, date, target, status) | Yes |
| `DELETE`| `/api/habits/:id` | **Delete** habit record from MongoDB | Yes |
| `PATCH`| `/api/habits/:id/toggle` | Quick toggle between Pending and Completed | Yes |
| `PATCH`| `/api/habits/:id/progress`| Update numerical progress value | Yes |
| `GET` | `/api/habits/analytics/summary` | Fetch weekly/monthly completion analytics | Yes |
| `GET` | `/api/habits/calendar/overview` | Fetch date-mapped calendar overview | Yes |
| `POST` | `/api/habits/seed` | Seed demo habits with realistic history | Yes |

---

## 🏆 College Hackathon Compliance

* **Topic:** Lifestyle & Personal Management – 13. Habit Tracking Application
* **Core Managed Fields:** Habit → Date → Target → Completion Status
* **MERN Stack:** MongoDB + Express.js + React.js + Node.js
* **No Unrelated Complexities:** Pure habit tracking without unrelated social media, chat, payments, or AI gimmicks.
* **Production Polish:** Modern UI, subtle animations, responsive design, dark mode, and feedback states.
