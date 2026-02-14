# CivicBridge

Transparent community–government feedback platform. Residents report civic issues; officials update status; everyone sees the full lifecycle with SLA tracking and community upvoting.

## Tech stack

- **Next.js 14** (App Router), JavaScript
- **Tailwind CSS**
- **MongoDB Atlas** + Mongoose
- **Custom session auth** (HTTP-only cookies, MongoDB session store, bcrypt)
- **Vercel** deployment

## Setup

1. Clone and install:

   ```bash
   npm install
   ```

2. Copy env and set variables:

   ```bash
   cp .env.example .env.local
   ```

   - `MONGODB_URI`: MongoDB Atlas connection string
   - `SESSION_SECRET`: Long random string for session security

3. Run dev server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## Demo flow

1. **Register** as a resident → submit an issue (title, description, category, severity, optional image/lat-lng).
2. **Dashboard** → see all issues, filter by category/severity/status, sort by newest / oldest / upvotes. Open an issue → view timeline, SLA, upvote (when logged in).
3. **Register** (or use another account) as an **official** → log in.
4. **Official dashboard** → view issues, filter by status, update status (dropdown + note + optional resolution image). Check **analytics**: total/open/resolved, avg resolution time, top category, trending issue.
5. **Map view** (Dashboard → Map view) → issues with lat/lng shown on a Leaflet map.

## Deployment (Vercel)

1. Push to GitHub and import the project in Vercel.
2. Set environment variables: `MONGODB_URI`, `SESSION_SECRET`.
3. Deploy.





## Features

- **Auth**: Register (resident/official), login, session in MongoDB, HTTP-only cookie, 7-day expiry.
- **Issues**: Submit (resident), list with filters/sort, detail with status timeline, SLA timer (green &lt;24h, yellow 24–48h, red 48h+), upvote (once per user).
- **Officials**: Update status (state machine), add notes, upload resolution image; analytics (totals, open, resolved, avg resolution time, top category, trending).




[![Watch the video](https://drive.google.com/uc?export=view&id=1-GuBlgRDObsZDbQ1jSMsyai6tgAPLsLR)](https://drive.google.com/file/d/1fgshd3TQVM4TIMREs79oHUclmjMztxcf/view?usp=sharing)


[Deployment Link:](https://cibi-beige.vercel.app/)
