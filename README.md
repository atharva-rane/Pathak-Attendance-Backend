# Pathak Attendance — Backend

Node.js + Express + MongoDB (Mongoose) API for the Dhol Tasha attendance system.

## 1. Install dependencies

```bash
cd "Pathak Attendance Backend"
npm install
```

This installs everything listed in `package.json`:
`express`, `mongoose`, `dotenv`, `cors`, `jsonwebtoken`, `bcryptjs` (and `nodemon` for local dev).

## 2. Set up MongoDB Atlas (step by step)

You don't need to install MongoDB locally — Atlas is MongoDB's free hosted service.

1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account.
2. Click **"Build a Database"** → choose the **M0 Free** tier → pick any cloud provider/region close to you → click **Create**.
3. **Create a database user**: under "Security → Database Access", click **Add New Database User**. Choose a username/password (autogenerate is fine) — save these, you'll need them for the connection string.
4. **Allow network access**: under "Security → Network Access", click **Add IP Address**. For development choose **"Allow access from anywhere"** (0.0.0.0/0) — this is also what you'll need once deployed on Vercel, since Vercel's serverless functions don't have a fixed IP.
5. **Get your connection string**: go to "Database" → click **Connect** on your cluster → **Drivers** → copy the connection string, it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Paste it into your `.env` file as `MONGO_URI`, replacing `<username>` and `<password>` with the database user you created, and add a database name before the `?`, e.g.:
   ```
   MONGO_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/pathak_attendance?retryWrites=true&w=majority
   ```
   (The database `pathak_attendance` will be created automatically the first time data is written.)

## 3. Configure environment variables

```bash
cp .env.example .env
```

Then edit `.env` and fill in:
- `MONGO_URI` — from step 2 above
- `JWT_SECRET` — any long random string (e.g. generate one at https://randomkeygen.com)
- `CLIENT_ORIGIN` — your frontend URL (`http://localhost:5173` for local dev; add your deployed Vercel frontend URL later, comma-separated if you need both)

## 4. Create the admin login

Since this app has only one admin, run the seed script once to create the login credentials:

```bash
npm run seed:admin
```

Open `seed/createAdmin.js` first and change `ADMIN_USERNAME` / `ADMIN_PASSWORD` to what you actually want before running it.

## 5. Run locally

```bash
npm run dev
```

Server runs at `http://localhost:5000`. Test it by visiting `http://localhost:5000` in your browser — you should see "Pathak Attendance API is running".

## 6. Deploy to Vercel

```bash
npm i -g vercel
vercel login
vercel
```

After deploying:
1. Go to your project on vercel.com → **Settings → Environment Variables** and add `MONGO_URI`, `JWT_SECRET`, `CLIENT_ORIGIN` (same values as your `.env`).
2. Redeploy (`vercel --prod`) so the env vars take effect.
3. Copy the deployed backend URL (e.g. `https://pathak-attendance-backend.vercel.app`) — you'll need it as `VITE_API_URL` in the frontend's `.env`.
4. Go back into Atlas Network Access and make sure 0.0.0.0/0 is allowed (Vercel functions use dynamic IPs).

## API Overview

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | No | Login, returns JWT token |
| POST | `/api/auth/logout` | Yes | Logout (client discards token) |
| GET | `/api/auth/me` | Yes | Get current admin |
| GET | `/api/students?vadan=Dhol` | Yes | List students, optional vadan filter |
| POST | `/api/students` | Yes | Add a student |
| PUT | `/api/students/:id` | Yes | Update a student |
| DELETE | `/api/students/:id` | Yes | Delete a student |
| GET | `/api/attendance?date=YYYY-MM-DD&vadan=Dhol` | Yes | Get attendance for a date |
| POST | `/api/attendance` | Yes | Mark/update attendance `{ studentId, date, status }` |
| GET | `/api/attendance/summary?date=YYYY-MM-DD` | Yes | Present/Absent totals for a date |
