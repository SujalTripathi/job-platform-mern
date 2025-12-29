# Job Platform (MERN)

A modern job & internship platform built with the MERN stack (MongoDB, Express, React, Node) — small, focused, and production-friendly.

## 🚀 Features

- Post jobs with title, company, location, type, skills and description
- Browse and search jobs by title, location, type and skills
- Role-aware dashboard (future enhancement)
- Pagination, sorting (newest/oldest)
- Responsive design with Bootstrap
- API routes with simple authentication-ready structure

## 🔧 Quick start (development)

1. Backend

```bash
cd server
npm install
# Create a .env file (example below)
node server.js
```

2. Frontend

```bash
cd client
npm install
npm run dev
```

Open the app at: `http://localhost:5173`

## .env (server)

Create `server/.env` with:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.example.mongodb.net/?retryWrites=true&w=majority
PORT=4000
JWT_SECRET=your_jwt_secret_here
```

Notes:
- Make sure your MongoDB Atlas IP Access List includes your machine's IP (Network Access → Add IP Address).
- Use the full `mongodb+srv://` connection string from Atlas.

## 🧭 Project structure

```
job-platform-mern/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # Header, small components
│   │   ├── pages/          # Search, City, Type pages
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── server/                 # Express backend
    ├── server.js
    ├── package.json
    └── .env
```

## 🐞 Troubleshooting

- "MongoDB connection failed: querySrv ENOTFOUND" → Run `nslookup -type=SRV _mongodb._tcp.<your-cluster-hostname>` to verify DNS; ensure Atlas IP whitelist and no VPN/DNS blocking.
- CORS errors → Server prints origin in logs; add origin to `ALLOWED_ORIGINS` or run frontend from `localhost:5173`.
- Navbar toggle not working on mobile → Ensure Bootstrap JS is loaded (we import `bootstrap/dist/js/bootstrap.bundle.min.js` in `main.jsx`).

## ✅ Development tips

- To add authentication later, use the existing Auth flow placeholders and add `jsonwebtoken` + `bcryptjs` on the server.
- For styling, we use Bootstrap plus a small `custom.css` for theme tweaks.

---

If you'd like, I can:
- Add unit tests for API endpoints
- Add CI (GitHub Actions) for linting/tests
- Implement role-based permissions (employer/jobseeker)

Tell me which follow-up you'd like and I'll implement it next. ✨