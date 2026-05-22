# TaskFlow

A team task management app where admins can create projects, assign tasks to members, and everyone can track progress through a clean dashboard. Built as a full-stack project using React, FastAPI, and MongoDB.

## What it does

- **Admins** can create projects, add team members (from a dropdown), create tasks with due dates, and assign them to specific members.
- **Members** can view their assigned projects and tasks, and update task status (Todo → In Progress → Completed).
- There's a **dashboard** that gives a quick overview — total tasks, completed, in progress, and overdue count.
- The app supports **dark mode** with a toggle button. Your preference is saved so it stays the same when you come back.
- A **landing page** introduces the app before login.

## Tech used

**Frontend:** React 18, Vite, Tailwind CSS, React Router, Axios  
**Backend:** FastAPI (Python), MongoDB with Motor (async driver), JWT auth, bcrypt password hashing

## How to run it locally

### Backend

```bash
cd server
python -m venv venv
venv\Scripts\activate        # on Windows
# source venv/bin/activate   # on Mac/Linux
pip install -r requirements.txt
```

Create a `server/.env` file:

```
MONGODB_URL=your_mongodb_connection_string
SECRET_KEY=any_random_secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

Then run:

```bash
uvicorn app.main:app --reload
```

Server starts on `http://localhost:8000`

### Frontend

```bash
cd client
npm install
```

Create a `client/.env` file:

```
VITE_API_URL=http://localhost:8000
```

Then run:

```bash
npm run dev
```

Opens on `http://localhost:5173`

## Folder structure

```
taskmanager/
├── client/                  # React frontend
│   ├── src/
│   │   ├── api/             # Axios setup with JWT
│   │   ├── components/      # Sidebar, TaskCard, ProtectedRoute
│   │   ├── context/         # Auth + Theme providers
│   │   └── pages/           # Landing, Login, Signup, Dashboard, Projects, Tasks
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                  # FastAPI backend
│   ├── app/
│   │   ├── main.py          # App entry + CORS
│   │   ├── auth.py          # JWT + bcrypt utils
│   │   ├── database.py      # MongoDB connection
│   │   ├── models.py        # Pydantic schemas
│   │   ├── dependencies.py  # Auth middleware
│   │   └── routes/          # auth, projects, tasks
│   └── requirements.txt
│
├── .gitignore
└── README.md
```

## API routes

**Auth**
- `POST /auth/signup` — register with name, email, password, role
- `POST /auth/login` — returns JWT token
- `GET /auth/members` — list all member-role users (admin only)

**Projects**
- `POST /projects/` — create a project (admin)
- `GET /projects/` — get all projects (admin sees all, members see theirs)
- `POST /projects/:id/members` — add a member to a project
- `GET /projects/:id/members` — get members of a project

**Tasks**
- `POST /tasks/` — create and assign a task (admin)
- `GET /tasks/` — list tasks
- `PATCH /tasks/:id/status` — update task status
- `GET /tasks/dashboard` — get stats for the dashboard

## Roles

**Admin** — can do everything: create projects, add members, create tasks, assign work, view all data.

**Member** — can see projects they're part of, view their assigned tasks, and update task status.

## Dark mode

There's a toggle in the sidebar (moon/sun icon). On login and signup pages, there's a small button in the top-right corner. The preference saves to localStorage so it persists.

---

Built by Shashank
