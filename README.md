# Task Management System (Full Stack)

A full-stack **Task Management System** built as part of a software engineering assessment.
The project includes a secure backend API built with **Node.js, Express, TypeScript, Prisma, and PostgreSQL**, and a responsive web frontend built with **Next.js (App Router) and TypeScript**.

---

## 🚀 Live Demo

- **Frontend:** https://task-management-system-sepia-five.vercel.app
- **Backend API:** https://task-management-system-svk7.vercel.app

---

## 🧱 Tech Stack

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL (cloud database)
- JWT Authentication (Access & Refresh Tokens)
- bcrypt for password hashing
- Deployed on **Vercel (Serverless)**

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Fetch API with centralized `apiFetch`
- Toast notifications
- Deployed on **Vercel**

---

## 🔐 Authentication Features

- User Registration
- User Login
- JWT-based authentication
  - **Access Token** (short-lived)
  - **Refresh Token** (long-lived)
- Secure Logout (refresh token invalidation)
- Passwords hashed using bcrypt

### Auth Endpoints

| Method | Endpoint | Description |
|------|--------|------------|
| POST | /auth/register | Register a new user |
| POST | /auth/login | Login user |
| POST | /auth/refresh | Refresh access token |
| POST | /auth/logout | Logout user |

---

## ✅ Task Management Features (CRUD)

Each task belongs to the **logged-in user only**.

### Task Capabilities
- Create a task
- Edit a task
- Delete a task
- Toggle task status (Pending / Completed)
- Pagination
- Filtering by status
- Searching by title

### Task Endpoints

| Method | Endpoint | Description |
|------|--------|------------|
| GET | /tasks | Get tasks (pagination, filter, search) |
| POST | /tasks | Create a new task |
| GET | /tasks/:id | Get a task by ID |
| PATCH | /tasks/:id | Update a task |
| DELETE | /tasks/:id | Delete a task |
| POST | /tasks/:id/toggle | Toggle task status |

---

## 🖥 Frontend Features

- Login & Registration pages
- Task dashboard
- Add / Edit / Delete / Toggle tasks
- Pagination with user-selected page size
- Search by task title
- Filter by task status
- Responsive UI (mobile & desktop)
- Toast notifications for actions
- Automatic logout on token expiration

---

## ⚙️ Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret

## Frontend Environment Variables

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=https://task-management-system-svk7.vercel.app

---

## 🛠 Backend Setup (Local)

cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev

---

## 🛠 Frontend Setup (Local)

cd frontend
npm install
npm run dev


⸻

🌐 Deployment Notes
	•	Backend runs as a Vercel Serverless Function
	•	Prisma Client is generated using postinstall to avoid Vercel caching issues
	•	CORS is explicitly configured to allow frontend domain and HTTP methods (GET, POST, PATCH, DELETE)
	•	Tokens are sent via Authorization: Bearer <token> headers

⸻

📌 Key Design Decisions
	•	JWT-based stateless authentication
	•	Prisma ORM for type-safe database access
	•	Centralized API handling via apiFetch
	•	Clear HTTP status codes (400, 401, 404, 500)
	•	Responsive UI with Tailwind CSS

⸻

👤 Author

Manish Kumar
Full Stack Developer (React / Next.js / Node.js)

⸻

✅ Assignment Status

✔ Authentication (Login, Register, Logout, Refresh)
✔ Task CRUD with ownership
✔ Pagination, Filtering, Searching
✔ Responsive Frontend
✔ Deployed on Vercel

⸻

Thank you for reviewing this project 🙌
