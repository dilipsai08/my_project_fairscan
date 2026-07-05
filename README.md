# FairScan

A crowdsourced healthcare transparency platform where patients compare diagnostic test prices and understand medical prescriptions using AI.

---

## Problem Statement

Healthcare pricing lacks transparency at the point of need. Diagnostic procedures (like MRI scans, CT scans, blood panels, ultrasounds etc.) vary in cost by a factor of five to ten across facilities within the same city. No centralised resource exists for patients to check a reference price before undergoing a test, so most end up paying higher bills.

A separate but related issue is prescription comprehension. Medical prescriptions are written in clinical shorthand and Latin abbreviations that most patients cannot interpret, leaving them with no practical understanding of what has been prescribed or why.

FairScan addresses both: pricing opacity and prescription illegibility.

---

## What It Does

### 1. Diagnostic Test Price Comparison
Users submit a test name, the price they were charged, and their hospital tier (Standard or Premium). The system records the entry and returns the current median price for that test, at that location, for that tier. A cumulative savings tracker shows how much each user has saved over time by knowing the market rate before they go.

### 2. AI Prescription Reader
Users upload a prescription image with a text query. A vision-language model reads the image, extracts medicine names, converts the shorthand into plain language, explains the common uses of each drug and answer to the the user queries. [The system explicitly does not diagnose conditions, recommend dosages, or suggest changes to treatment.]

### 3. Medicine Information Lookup
Users search for a medicine by name. The system first checks a local database. If nothing matches, it queries the OpenFDA Drug Label API and returns the name, manufacturer, general use, and known side effects.

### 4. Authentication
Sign-in via Google, GitHub, or Amazon OAuth through Passport.js. New OAuth users are walked through a one-time onboarding form to collect essential details. Standard email/password login is also supported. Sessions are managed with JWT stored in HTTP-only cookies.

### 5. Trust Score
Each user has a trust score that starts at 48.000. Daily, the backend computes the median price for each test and compares each user's submitted price against it. Submissions within 20% of the median earn points; outliers lose them. Users who fall below 35 lose search access. This is a mechanism to discourage fake submissions.

---

## How the Data Pipeline Works

This is probably the most interesting part of the backend. Price data goes through three stages:

1. **Raw submissions** → `user_raw_data_entries` (every time a user submits a price, it lands here)
2. **Daily median** → `daily_median_prices` (a scheduled SQL job runs at 2 AM, computing the actual median across submissions from the prior day, grouped by test, pincode, tier, and hospital)
3. **Weekly aggregation** → `test_prices` (every Friday at 3 AM, a second job takes the median of the last 7 days of daily medians and writes the final displayed price)

The trust score update runs between steps 2 and 3, after the daily median is available to compare against.

---

## System Architecture

```
┌────────────────────────────────────────────────┐
│                  Frontend                      │
│     React 19 · React Router 7 · Vite           │
│     Tailwind CSS 4 · Axios                     │
└───────────────────┬────────────────────────────┘
                    │  HTTPS
┌───────────────────▼────────────────────────────┐
│                  Backend                       │
│         Express 5  ·  Node.js                  │
│                                                │
│  Auth (Passport + JWT)  │  Services layer      │
│  Rate limiting          │  AI pipeline         │
│  IP ban middleware      │  (BullMQ + SSE)      │
└──────┬────────────────────────┬────────────────┘
       │                        │
  ┌────▼─────┐            ┌─────▼──────┐   ┌───────────────┐
  │PostgreSQL│            │   Redis    │   │  OpenRouter   │
  │(primary  │            │(queue,rate │   │  (AI vision   │
  │ storage) │            │ limits,    │   │   models)     │
  │          │            │ IP bans)   │   │               │
  └──────────┘            └────────────┘   └───────────────┘
```

**Deployed on:** AWS EC2 · Nginx · PM2 · Let's Encrypt (TLS)

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router 7, Vite, Tailwind CSS 4, Axios |
| Backend | Node.js, Express 5, ES Modules |
| Database | PostgreSQL (raw SQL, no ORM) |
| Cache / Queue | Redis, BullMQ |
| Auth | Passport.js (Google, GitHub, Amazon OAuth 2.0), JWT, bcrypt |
| AI | OpenRouter API (vision-language models with fallback chain) |
| External API | OpenFDA Drug Label API |
| Real-time | Server-Sent Events (SSE) for queue position updates |
| Security | express-rate-limit, Redis-backed IP banning, CORS, HTTP-only cookies |
| Logging | Winston with daily rotating log files |
| Infrastructure | AWS EC2, Nginx, PM2, Let's Encrypt |

---

## Security and Rate Limiting

The abuse prevention system has three layers:

- **Per-endpoint rate limiters** — search is capped at 4 req per min, AI at 5 req per 15 min, OAuth at 25 req per 5 min. Limits are stored in Redis so they survive server restarts
- **Automatic IP banning** — exceeding any rate limit triggers a Redis-stored ban ranging from 24 to 72 hours depending on the endpoint. A global middleware checks every incoming request against the ban list before it reaches any route handler
- **AI queue concurrency control** — BullMQ processes one AI job at a time, with a hard limit of 2 jobs per min.

---

## AI Pipeline Detail
prescription image requests are not handled synchronously. The flow is:

1. User submits image → request is added to a BullMQ queue
2. Client opens an SSE connection and receives its queue position in real time
3. Worker picks up the job (concurrency: 1), sends the image to OpenRouter as base64
4. The system tries models in order: `nvidia/nemotron-nano-12b-v2-vl`, then `meta-llama/llama-3.2-90b-vision-instruct`, then `qwen/qwen-2-vl-72b-instruct`.(If any model fails to give response, we use another model...)
5. Result is sent back over SSE; the connection closes.

---

## Database Schema

Nine tables total. The relevant ones for the core logic:

| Table | Purpose |
|---|---|
| `zip_codes` | Pincode directory with division, region, and circle names |
| `users` | Accounts, credentials, trust score, cumulative savings |
| `tests` | Master list of diagnostic test names |
| `user_raw_data_entries` | Individual price submissions from users |
| `daily_median_prices` | Daily computed medians per test, location, and tier |
| `test_prices` | Weekly aggregated price shown to users |
| `medicines` | Local medicine reference data |
| `health_tips` | Dashboard content |
| `user_activities` | Audit log of all user actions |

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/auth/:provider` | No | Initiate OAuth flow |
| GET | `/auth/:provider/callback` | No | OAuth callback |
| POST | `/api/auth/complete-profile` | No | Onboarding after OAuth |
| POST | `/api/login/submit` | No | Email/password login |
| GET | `/api/auth/verify-session` | Yes | Validate session |
| POST | `/api/auth/logout` | No | Clear auth cookie |
| GET | `/api/user/info` | Yes | Name, savings, test count |
| GET | `/api/user/profile` | Yes | Full profile |
| GET | `/api/user/activity` | Yes | Activity history |
| POST | `/api/search-test` | Yes | Submit price, get median |
| GET | `/api/medicine/info?q=` | Yes | Medicine lookup |
| GET | `/api/get-location` | Yes | Location from pincode |
| POST | `/api/ai-chat-submit` | Yes | Submit prescription image |
| GET | `/api/queue/status` | No | SSE stream for queue position |
| GET | `/api/health-tips` | No | Dashboard health tips |

---

## Project Structure

```
project_2/
├── Frontend/
│   └── src/
│       ├── components/       # Header, Footer, ProtectedRoute, constants
│       ├── pages/            # 14 page components
│       ├── style.css
│       ├── style_2.css
│       └── main.jsx          # Entry point and route definitions
│
└── Backend/
    ├── Server.js             # Express setup and route registration
    ├── config/
    │   ├── db.js             # PostgreSQL connection pool
    │   └── Passport_strategies.js
    ├── db.sql                # Full schema and scheduled SQL logic
    └── src/
        ├── Controllers/      # Auth controller
        ├── Services/         # Search, medicine, profile, location
        ├── Models/           # Database query functions
        ├── AI_Providers/     # BullMQ queue, worker, SSE, OpenRouter
        ├── middleware/       # Auth, error handler, rate limiting
        └── utils/            # Logger setup
```

---

## Conclusion

This is a working prototype deployed on AWS EC2. The price data improves as more users contribute — accuracy in underrepresented areas will naturally be low until there are enough submissions. The trust score system is designed to self-correct for that over time.

If you are reading this from my resume, the live demo link is on the project title. Feel free to create an account and try the prescription reader.Thank You!!!