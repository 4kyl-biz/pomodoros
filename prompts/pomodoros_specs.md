# Pomodoro Web Application – Software Specification

_Mobile-first, PWA-ready, built with Next JS (App Router), shadcn/ui, Supabase & Vercel_

---

## 1 . Vision & Goals

Provide individuals with a distraction-free, data-driven Pomodoro timer that:

- **Helps structure work-/break-cycles** and keeps users on task.
- **Surfaces insights** (daily / weekly totals, heat-map calendar, streaks) to reinforce habits.
- **Works instantly** (anonymous mode) yet offers **opt-in cloud sync** across devices.
- **Installs like an app** on mobile / desktop via PWA.

---

## 2 . Tech Stack

| Layer      | Choice                                                                          | Rationale                                               |
| ---------- | ------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Frontend   | **Next JS 15** (App Router) · **TypeScript** · **Tailwind CSS** · **shadcn/ui** | Component islands, fast refresh, headless UI primitives |
| Backend    | **Supabase** (PostgreSQL, Row-Level Security, Auth, Storage, Edge Functions)    | Handles auth, real-time data, GDPR exports              |
| Deployment | **Vercel** (preview → prod)                                                     | Zero-config CI/CD, serverless functions                 |
| PWA        | `next-pwa` plugin + custom SW                                                   | Offline shell & “Add to Home Screen”                    |
| Licensing  | **MIT**                                                                         | Encourage community adoption                            |

---

## 3 . Functional Requirements

### 3.1 Core (MVP)

| #   | Feature               | Description                                          | Acceptance Criteria                                                     |
| --- | --------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------- |
| F1  | Start / Pause / Reset | Single button toggles start ↔ pause; dedicated reset | Timer state persists on tab refresh; reset sets time to session default |
| F2  | Work Session (25 min) | Default length 25 min                                | Countdown reaches 0 without drift (< ±1 s per 25 min)                   |
| F3  | Short Break (5 min)   | Auto-enter or manual toggle                          | Visual state clearly distinguishes break vs work                        |
| F4  | Long Break (15 min)   | After **4** completed Pomodoros                      | Counter resets after long break                                         |
| F5  | Cycle Counter         | Displays Pomodoros completed today                   | Updates in real time                                                    |
| F6  | Alert Sound           | Built-in library (3 tones)                           | Plays at 0 s; user can mute                                             |

### 3.2 Enhanced

| #   | Feature             | Description                                                      |
| --- | ------------------- | ---------------------------------------------------------------- |
| F7  | Custom Durations    | User adjusts work / short / long break lengths (1–60 min)        |
| F8  | Auto-Cycle          | Optional: auto-start next session after 10 s grace               |
| F9  | Theme Picker        | Light / Dark predefined palettes (no custom upload)              |
| F10 | In-tab Notification | HTML5 Notification API prompts when timer ends in background tab |
| F11 | Keyboard Shortcuts  | Space = Start/Pause · R = Reset                                  |

### 3.3 Advanced

| #   | Feature                 | Description                                                                                        |
| --- | ----------------------- | -------------------------------------------------------------------------------------------------- |
| A1  | **User Auth (opt-in)**  | Anonymous by default; email / OAuth sign-in upgrades account & migrates local data                 |
| A2  | **Tasks & Notes**       | Each Pomodoro may link to a task (title, optional description, tag list) & short post-session note |
| A3  | **Analytics Dashboard** | ① Daily / weekly totals ② Heat-map calendar (365 cells) ③ Longest streak, current streak           |
| A4  | **Data Export**         | One-click download of JSON or CSV (sessions, tasks, notes)                                         |
| A5  | **Right-to-Delete**     | Self-service account wipe (Supabase function + storage purge)                                      |
| A6  | **Installable PWA**     | Web App Manifest, service worker, offline shell for timer UI                                       |

---

## 4 . Non-Functional Requirements

| Aspect                          | Requirement                                                                                                       |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Mobile-first**                | ≥ 320 px width; thumb-reachable controls                                                                          |
| **Internationalisation (i18n)** | English (default) & Chinese (`/zh`) via `next-intl`; language auto-detected by browser locale, toggle in settings |
| **Time Handling**               | All times stored in UTC, converted to user’s local tz on render                                                   |
| **Accessibility**               | shadcn/ui defaults (ARIA labels, focus rings) are sufficient – no WCAG target                                     |
| **Performance**                 | No explicit budget; rely on Next JS defaults                                                                      |
| **Security**                    | Supabase RLS, HTTPS only, rate-limit auth endpoints                                                               |
| **License**                     | MIT; repo includes `LICENSE` & `CONTRIBUTING.md`                                                                  |

---

## 5 . Data Model (Supabase → PostgreSQL)

| Table           | Key Fields                                                                                                                             | Notes                                              |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `users`         | `id` (uuid, PK) · `email` · `created_at`                                                                                               | Supabase Auth managed                              |
| `sessions`      | `id` (uuid) · `user_id` (nullable) · `type` (`work` / `short_break` / `long_break`) · `started_at` · `ended_at` · `task_id` (nullable) | RLS allows user or anon JWT to read/write own rows |
| `tasks`         | `id` · `user_id` · `title` · `status` (`todo` / `done`) · `created_at`                                                                 |
| `notes`         | `id` · `session_id` · `content` (text)                                                                                                 |
| `tags`          | `id` · `user_id` · `label`                                                                                                             |
| `task_tag_xref` | `task_id` + `tag_id`                                                                                                                   | M-N bridge                                         |
| `preferences`   | `user_id` · JSONB (`durations`, `auto_cycle`, `theme`, `lang`)                                                                         |

_Export respects JOINs to deliver a single JSON/CSV archive._

---

## 6 . Architecture

```
Browser (Next JS SPA/PWA)
  │
  ├── Edge Runtime (Next API Routes) → Supabase REST & Realtime
  │
  └── Supabase
        ├── Auth (JWT, anon & email)
        ├── Postgres (RLS)
        ├── Storage (none required now)
        └── Edge Functions (export, delete)
```

Service Worker caches `/_next/static/*` + `/api/tick` fallback for offline timer tick logic (in-memory).

---

## 7 . Key User Flows

1. **Quick Start (Anon)**  
   → Load app → Tap **Start** → Work 25 min → Ding! → Short break auto-begins → Repeat → Data saved to `localStorage`.

2. **Account Upgrade**  
   → “Sign in to sync” → OAuth redirect → On success, migrate local data → Sessions instantly visible on second device.

3. **Task-Linked Pomodoro**  
   → Create task “Write Proposal” → Select task, start timer → On complete, enter note → Task progress updates.

4. **Analytics**  
   → Open Dashboard → View heat-map → Tap a cell (2025-08-03) → Modal lists 8 sessions & total focus = 3 h 20 m.

5. **Export / Delete**  
   → Settings → “Download my data” → Edge Function signs URL for ZIP download.  
   → Settings → “Delete account” → Confirm → Edge Function cascades delete & revokes token.

---

## 8 . Environment Configuration (`.env.local`)

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # used only in Edge Functions
NEXT_PUBLIC_APP_VERSION=2025-08-03
```

---

## 9 . Testing & QA Checklist

- Timer accuracy (±1 s / 25 min) across tab visibility changes
- PWA install on iOS Safari & Android Chrome
- Intl routing `/` ↔ `/zh`
- GDPR export produces valid JSON & CSV, size ≤ 5 MB for 10 k sessions
- RLS rules verified via PostgREST (cannot read others’ data)

---

**End of Specification**
