## 📋 Pomodoro App — Implementation Checklist  

> `☐` = Not started `☑` = Done  
> New **Phase 5 – Testing & QA Automation** added; subsequent phases renumbered.

---

### **Phase 0 – Project Scaffold** *(easiest)*
| Task | Acceptance Criteria |
| --- | --- |
| ☑ **Create repo & initialise Next JS 15 project** | App runs `next dev` with the default page rendered. |
| ☑ **Add Tailwind CSS & shadcn/ui** | A sample `<Button>` renders with Tailwind styles. |
| ☑ **Configure Supabase client** | `await supabase.from('pg_catalog.pg_tables')` succeeds in DevTools. |
| ☐ **Push to GitHub & connect Vercel** | Preview deploy succeeds and shows starter page. |

---

### **Phase 1 – Core Timer MVP**
| Task | Acceptance Criteria |
| --- | --- |
| ☑ **`usePomodoroTimer` hook** | Start → pause → resume → reset flow works; ±1 s drift per 25 min. |
| ☑ **Short & long break logic** | 4 work sessions trigger 15 min break; counter resets. |
| ☑ **Sound alerts + mute** | Tone fires at 0 s; mute silences it. |
| ☑ **Persist to `localStorage`** | Refresh preserves timer & cycle count. |
| ☑ **Mobile-first UI** | 320 px device shows controls without horizontal scroll. |

---

### **Phase 2 – Preferences & Theming**
| Task | Acceptance Criteria |
| --- | --- |
| ☐ **Settings page** (durations, auto-cycle) | New work length applies and persists. |
| ☐ **Theme picker** | Light ↔ Dark toggle persists. |
| ☐ **In-tab notifications** | Background-tab notification fires at session end. |

---

### **Phase 3 – Auth, Tasks & Notes**
| Task | Acceptance Criteria |
| --- | --- |
| ☐ **Supabase Auth (email + GitHub)** | User can sign in/out; user row created. |
| ☐ **Local → cloud migration** | Sign-in uploads prior local sessions; second device sees same data. |
| ☐ **CRUD Tasks** | Create/edit/delete task; moves in Supabase. |
| ☐ **Attach task & note** | Completing a session saves a note visible on session detail. |

---

### **Phase 4 – Analytics Dashboard**
| Task | Acceptance Criteria |
| --- | --- |
| ☐ **`/api/stats` aggregation** | Route returns totals, streaks, day-grouped data. |
| ☐ **Heat-map calendar** | 365-cell map renders; click shows day sessions. |
| ☐ **Streak counters** | Values match manual calc for test data. |
| ☐ **Weekly totals chart** | Chart updates within 300 ms on range change. |

---

### **Phase 5 – Testing & QA Automation**
| Task | Acceptance Criteria |
| --- | --- |
| ☐ **Set up tooling** (Vitest or Jest + React-Testing-Library; Cypress/Playwright) | `pnpm test` runs unit tests; `pnpm e2e` launches Cypress locally. |
| ☐ **Unit tests — core logic** (`usePomodoroTimer`, streak calc) | ≥ 90 % branch coverage on utilities; failing test blocks CI. |
| ☐ **Integration tests — Supabase CRUD** | Create → read → update → delete task test passes against local Supabase. |
| ☐ **E2E smoke — critical flows** | Cypress script completes: Start timer → session ends → sign in → data synced. |
| ☐ **Timer accuracy regression** | Automated test simulates tab blur/focus; max drift ≤ 1 s/25 min. |
| ☐ **CI Workflow** (GitHub Actions) | Pull-request runs unit + e2e suites; green check required to merge. |

---

### **Phase 6 – PWA Installation**
| Task | Acceptance Criteria |
| --- | --- |
| ☐ **Web App Manifest & icons** | “Add to Home Screen” prompt appears on Android Chrome. |
| ☐ **Service Worker (next-pwa)** | Offline visit loads timer page & countdown works. |
| ☐ **Update flow** | New deploy triggers “New version available” toast; reload fetches latest assets. |

---

### **Phase 7 – GDPR, Export & Delete** *(hardest)*
| Task | Acceptance Criteria |
| --- | --- |
| ☐ **Edge Function `export_user_data`** | “Export” downloads ZIP ≤ 5 MB containing JSON & CSV. |
| ☐ **Edge Function `delete_user`** | Confirmed delete removes all user rows; token revoked. |
| ☐ **Security & RLS audit** | Automated test proves no cross-user data access. |
| ☐ **MIT License & docs** | `LICENSE` = MIT; `CONTRIBUTING.md` explains PR workflow. |

---

### **Project Done Criteria**
- Every task above is ☑.  
- Production deploy at **`https://pomodoro.example.com`** is live.  
- Team dog-foods for 24 h with zero blocking bugs.
