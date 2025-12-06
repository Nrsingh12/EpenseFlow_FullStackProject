# ExpenseFlow - Personal Expense Tracker

A modern full-stack web application to track your expenses, visualize spending patterns, and manage your personal finances effectively.

---

## Problem Statement

Managing personal finances can be challenging without proper tools. Traditional methods like spreadsheets and notes are time-consuming and error-prone. **ExpenseFlow** simplifies expense tracking by providing an intuitive platform to record expenses, analyze spending patterns, and maintain financial discipline.

---

## System Architecture

- **Frontend**: React.js, React Router
- **Backend**: Node.js, Express.js
- **Database**: MySQL / MongoDB (with Prisma ORM)
- **Authentication**: JWT-based login/signup
- **Hosting**
  - Frontend: Netlify / Vercel
  - Backend: Render / Railway
  - Database: MySQL Atlas / MongoDB Atlas / ElephantSQL / Aiven

---

## Key Features

| Category   | Feature                | Description                                                             |
|------------|------------------------|-------------------------------------------------------------------------|
| Auth       | Sign up, log in, log out | User registration with JWT authentication                             |
| Expenses   | CRUD                   | Add, view, edit, and delete entries; complete expense management        |
| Pages      | Home, Login, Dashboard | Multi-page navigation using React Router                                |
| Searching  | Search by description  | Full-text search to find expenses by description text                   |
| Sorting    | Sort by date, amount, category | Click table headers to sort expenses ascending/descending         |
| Filtering  | Filter by category, date range, amount range | Multi-criteria filtering with dropdown/date pickers   |
| Pagination | Display expenses by page | Navigate large expense lists with page numbers and next/prev buttons   |

---

## Additional Features

- **Hosting**: Deploy both backend and frontend to accessible URLs for live production
- **Responsive Design**: Mobile and desktop support; works seamlessly on all devices

---

## Tech Stack

| Layer      | Technologies                                |
|------------|---------------------------------------------|
| Frontend   | React.js, React Router, CSS3                |
| Backend    | Node.js, Express.js                         |
| Database   | SQLite (Development), Prisma ORM            |
| Auth       | JWT (JSON Web Tokens)                       |
| Hosting    | Vercel (Frontend), Render (Backend)         |

---

## API Overview

List of core APIs supporting search, sort, filter, and pagination:

| Endpoint                  | Method | Description                      | Access           |
|---------------------------|--------|----------------------------------|------------------|
| `/api/auth/signup`        | POST   | Create account                   | Anyone           |
| `/api/auth/login`         | POST   | Login                            | Anyone           |
| `/api/auth/logout`        | POST   | Logout                           | Logged-in users  |
| `/api/expenses`           | GET    | List all expenses with pagination| Logged-in users  |
| `/api/expenses`           | POST   | Add an expense                   | Logged-in users  |
| `/api/expenses/:id`       | GET    | Get single expense               | Logged-in users  |
| `/api/expenses/:id`       | PUT    | Edit expense                     | Logged-in users  |
| `/api/expenses/:id`       | DELETE | Remove expense                   | Logged-in users  |
| `/api/analytics/summary`  | GET    | Expense stats for dashboard      | Logged-in users  |

---

## Deployment

Deploy the frontend and backend to the chosen hosting providers and connect to the managed database services for a full production setup.

---

## Responsive Design

The application is designed to support both desktop and mobile devices for seamless experience everywhere.

---

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MySQL or MongoDB database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ExpenseFlow.git
cd ExpenseFlow
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

4. Set up environment variables:
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

5. Run database migrations:
```bash
cd backend
npx prisma migrate dev
```

6. Start the development servers:
```bash
# Backend (from backend directory)
npm start

# Frontend (from frontend directory)
npm start
```

---

