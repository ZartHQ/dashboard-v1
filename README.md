# Zart Admin Dashboard

Built with Next.js 14. All pages converted from the HTML prototypes with Zart brand identity.

---

## Quick start (5 minutes)

### 1. Install dependencies
```bash
npm install
```

### 2. Run locally
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 3. Login credentials (change before going live)
| Name       | Email               | Password         | Role        |
|------------|---------------------|------------------|-------------|
| Mia        | mia@zart.ng         | zart2026!mia     | Super Admin |
| Ifedamola  | ifedamola@zart.ng   | zart2026!ife     | Admin       |

---

## To add or remove admin access

Open `src/lib/admins.js` — the `ADMINS` array is the source of truth.

```js
// Add a new admin:
{
  id: 3,
  name: "New Person",
  initials: "NP",
  email: "newperson@zart.ng",
  password: "their_password",
  role: "admin",
  roleLabel: "Admin",
  color: "#FFC92A",
}
```

---

## Pages

| Route                      | Page        |
|----------------------------|-------------|
| `/`                        | Login       |
| `/dashboard/requests`      | Requests    |
| `/dashboard/artisans`      | Artisans    |
| `/dashboard/patrons`       | Patrons + Chat |
| `/dashboard/flags`         | Flags       |
| `/dashboard/payments`      | Payments    |
| `/dashboard/reports`       | Reports     |

---

## Deploy to Vercel (free)

1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → Import your repo
3. Vercel detects Next.js automatically — click Deploy
4. Your dashboard is live at `your-project.vercel.app`
5. Share the URL with your team — works on laptop and mobile browser

---

## Connect to Supabase (when ready)

1. Create a free project at supabase.com
2. Create a `.env.local` file:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```
3. Install the Supabase client: `npm install @supabase/supabase-js`
4. Replace the static data arrays in each page with Supabase queries
5. Enable Supabase Realtime on the `requests` table for live updates

---

## Project structure

```
src/
├── lib/
│   ├── admins.js      ← Admin access list (source of truth)
│   └── auth.js        ← Session helpers and useAdmin hook
├── components/
│   └── Sidebar.js     ← Shared navigation sidebar
├── pages/
│   ├── _app.js
│   ├── index.js       ← Login page
│   └── dashboard/
│       ├── requests.js
│       ├── artisans.js
│       ├── patrons.js
│       ├── flags.js
│       ├── payments.js
│       └── reports.js
└── styles/
    └── globals.css    ← All Zart brand styles
```

---

## Tech stack
- **Framework:** Next.js 14
- **Styling:** Custom CSS with Zart brand tokens (no Tailwind needed)
- **Font:** Outfit (Google Fonts)
- **Auth:** Session-based (sessionStorage) — upgrade to Supabase Auth for production
- **Deployment:** Vercel
