# CareerForge

**Unified Personal Career Intelligence Platform**

CareerForge is a full-stack Next.js application that combines AI-powered job discovery, intelligent matching, application tracking, and career analytics into a single powerful dashboard. Built for proactive job seekers who want to leverage technology to manage their entire job search pipeline.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-SQLite-2d3748?logo=prisma)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-New%20York-18181b)

---

## Features

### Dashboard
- Real-time overview of your job search pipeline
- Quick stats: total jobs, applications, match score averages, interviews
- Recent activity feed
- Quick action shortcuts

### Smart Job Search (5 Strategies)
- **AI Web Search** — Leverages AI-powered web search to find jobs matching your profile
- **Free Job APIs** — Aggregates from Remotive, Jobicy, Arbeitnow (instant results, no API keys)
- **Career Page Scanner** — Crawls company career pages directly for job listings
- **Bulk Company Scan** — Searches across all your targeted companies with custom keywords
- **Smart Mode** — Combines free APIs (instant) + AI web search (comprehensive)

### Intelligent Job Matching
- Weighted scoring algorithm (0-100) analyzing 12+ skill dimensions
- Primary skills matching (60 pts), secondary skills (15 pts), bonus signals (+39 pts)
- Penalty detection for exclusion signals (-30 pts)
- Hybrid scoring: fast rule-based + AI-powered insights
- Detailed breakdown with matching/missing skills, reasons, and recommendations

### Application Tracking (Kanban)
- Full pipeline: Interested → Applied → Interview → Offer → Rejected
- Drag-and-drop status updates
- HR contact management, follow-up reminders
- Priority levels (High/Medium/Low)
- Timeline tracking with date stamps

### Companies Database
- 100+ pre-loaded target companies with career page URLs
- Company-specific search keyword configuration
- Custom location filters per company
- Career page scanning with live progress
- Industry, tier, and priority classification

### Resume Builder
- AI-powered resume tailoring for specific job applications
- Cover letter generation
- Resume text parsing and management
- Download as text files

### Analytics & Insights
- Jobs by source distribution charts
- Match score distribution analysis
- Application pipeline visualization
- Skills gap analysis
- Top companies breakdown
- Timeline trends and salary analytics

### Settings
- Profile management (skills, target roles, preferences, salary range)
- JSON/CSV data export
- Job and application data management
- Database statistics overview

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui (New York) |
| Database | SQLite via Prisma ORM |
| State | Zustand + TanStack Query |
| Charts | Recharts |
| Icons | Lucide React |
| Animations | Framer Motion |
| AI SDK | z-ai-web-dev-sdk |

---

## Getting Started

### Prerequisites
- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/careerforge.git
cd careerforge

# Install dependencies
bun install

# Set up environment
cp .env.example .env

# Initialize database
mkdir -p db
bun run db:push

# Seed with sample data
bunx prisma db seed

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup

The project uses SQLite for zero-configuration local storage:

```bash
# Push schema to database
bun run db:push

# (Optional) Seed with sample data
bunx prisma db seed
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | SQLite database path | `file:./db/custom.db` |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with sidebar
│   ├── page.tsx                # Main app shell
│   ├── globals.css             # Global styles
│   └── api/
│       ├── dashboard/route.ts  # Dashboard statistics API
│       ├── analytics/route.ts  # Analytics data API
│       ├── profile/route.ts    # Profile CRUD API
│       ├── jobs/
│       │   ├── route.ts        # Jobs listing & management
│       │   ├── search/route.ts # Multi-strategy job search
│       │   └── [id]/
│       │       ├── route.ts    # Single job operations
│       │       └── match/route.ts # AI matching engine
│       ├── applications/route.ts    # Application tracking API
│       ├── companies/
│       │   ├── route.ts        # Company management API
│       │   └── [id]/route.ts   # Single company operations
│       ├── resume/
│       │   ├── parse/route.ts  # Resume parser API
│       │   └── tailor/route.ts # Resume tailoring API
│       └── activities/route.ts # Activity log API
├── components/
│   ├── dashboard/              # Dashboard page
│   ├── jobs/                   # Job cards, list, detail drawer
│   ├── applications/           # Kanban tracker
│   ├── companies/              # Company cards & management
│   ├── analytics/              # Charts & analytics
│   ├── resume/                 # Resume builder
│   ├── settings/               # Settings page
│   └── ui/                     # shadcn/ui components
├── hooks/                      # Custom React hooks
└── lib/
    ├── db.ts                   # Prisma client
    ├── match-engine.ts         # Scoring algorithm
    ├── types.ts                # TypeScript type definitions
    └── utils.ts                # Utility functions
prisma/
├── schema.prisma               # Database schema (6 models)
└── seed.ts                     # Seed data script
```

---

## Architecture

### Job Search Pipeline
```
User Query → Strategy Selection → API/Scraper/AI → Results → Deduplication → Store → Display
```

### Match Scoring Algorithm
```
Job Description
    ├── Primary Skills Match (60 pts max)
    ├── Secondary Skills Match (15 pts max)
    ├── Bonus Signals: MFT (+10), On-call (+7), Cloud (+5x2), SN/ITIL (+8), CI/CD (+4), Support (+6)
    └── Penalties: Dev-heavy role (-30), Exclusion keywords (-30)
    = Total Score (0-100)
```

### Data Models (6 tables)
- **Profile** — User career profile with skills, preferences, salary range
- **Company** — Target companies with career page URLs and search configs
- **Job** — Discovered job listings from all sources
- **JobMatch** — AI-powered match analysis and recommendations
- **Application** — Kanban-style application tracking pipeline
- **SavedSearch** — Reusable search configurations
- **ActivityLog** — Action audit trail

---

## Scripts

```bash
bun run dev          # Start dev server (port 3000)
bun run lint         # Run ESLint
bun run db:push      # Push schema changes to DB
bun run db:generate  # Generate Prisma client
bun run db:migrate   # Run database migrations
bun run db:reset     # Reset database completely
```

---

## License

This project is private and proprietary. All rights reserved.

---

## Acknowledgments

- Built with [Next.js](https://nextjs.org/), [shadcn/ui](https://ui.shadcn.com/), and [Prisma](https://www.prisma.io/)
- Job search powered by [z-ai-web-dev-sdk](https://www.npmjs.com/package/z-ai-web-dev-sdk)
- Free job data from [Remotive](https://remotive.com/), [Jobicy](https://jobicy.com/), [Arbeitnow](https://arbeitnow.com/)
