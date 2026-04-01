#  Task Manager App

A responsive Task Manager application built using React, Redux Toolkit, and MSW (Mock Service Worker). This app allows users to manage tasks with full CRUD functionality and mock authentication.

---

# Features

-  Login with mocked authentication
-  View list of tasks
-  Add new tasks
- Edit tasks
- Delete tasks
-  Toggle task status (Pending / Completed)
-  Protected routes (Dashboard requires login)
-  Data persistence using localStorage
-  Responsive UI with Tailwind CSS

---

# Tech Stack

- React (Vite)
- TypeScript
- Redux Toolkit
- React Router
- MSW (Mock Service Worker)
- Tailwind CSS




# Clone the repository

```bash
git clone <your-repo-link>
cd task-manager


# Project Structure

src/
│
├── app/              # Redux store
├── features/
│   ├── auth/         # Auth slice
│   └── tasks/        # Task slice
│
├── pages/
│   ├── Login.tsx
│   └── Dashboard.tsx
│
├── routes/
│   └── ProtectedRoute.tsx
│
├── services/
│   └── api.ts        # API calls
│
├── mocks/
│   ├── browser.ts
│   └── handlers.ts
│
├── main.tsx
└── App.tsx

# How Mocking Works (MSW)

This project uses Mock Service Worker (MSW) to simulate backend APIs.

Mocked APIs:

POST /login
GET /tasks
POST /tasks
PUT /tasks/:id
DELETE /tasks/:id

How it works:
MSW intercepts API requests
Returns mock responses
No real backend required