<p align="center">
  <img src="public/logo.svg" alt="CareerForge Logo" width="80" height="80"/>
</p>

<h1 align="center">CareerForge</h1>

<p align="center">
  <strong>Unified Personal Career Intelligence Platform</strong><br/>
  AI-powered job discovery, intelligent matching & application tracking
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Prisma-SQLite-2d3748?logo=prisma" alt="Prisma"/>
  <img src="https://img.shields.io/badge/shadcn%2Fui-New%20York-18181b" alt="shadcn/ui"/>
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License"/>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#screenshots">Screenshots</a>
</p>

---

CareerForge is a full-stack Next.js application that combines **AI-powered job discovery**, **intelligent matching**, **application tracking**, and **career analytics** into a single powerful dashboard. Built for proactive job seekers who want to leverage technology to manage their entire job search pipeline.

---

## Features

### 🏠 Dashboard
- Real-time overview of your entire job search pipeline
- Quick stats: total jobs, applications, match score averages, interviews
- Recent activity feed with actionable insights
- Quick action shortcuts for common tasks

### 🔍 Smart Job Search (5 Strategies)
| Strategy | Description | Speed |
|----------|-------------|-------|
| **AI Web Search** | Leverages AI-powered web search to find jobs matching your profile | Moderate |
| **Free Job APIs** | Aggregates from Remotive, Jobicy, Arbeitnow (no API keys needed) | Instant |
| **Career Page Scanner** | Crawls company career pages directly for job listings | Slow |
| **Bulk Company Scan** | Searches across all your targeted companies with custom keywords | Variable |
| **Smart Mode** | Combines free APIs (instant) + AI web search (comprehensive) | Best |

### 🎯 Intelligent Job Matching
- **Weighted scoring algorithm** (0-100) analyzing 12+ skill dimensions
- Primary skills matching (60 pts), secondary skills (15 pts), bonus signals (+39 pts)
- Penalty detection for exclusion signals (-30 pts)
- **Hybrid scoring**: fast rule-based + AI-powered insights
- Detailed breakdown with matching/missing skills, reasons, and recommendations

### 📋 Application Tracking (Kanban)
- Full pipeline: **Interested → Applied → Interview → Offer → Rejected**
- Drag-and-drop status updates
- HR contact management with follow-up reminders
- Priority levels (High/Medium/Low) with timeline tracking

### 🏢 Companies Database
- **100+ pre-loaded target companies** with career page URLs
- Company-specific search keyword & location configuration
- Career page scanning with live progress indicators
- Industry, tier, and priority classification

### 📄 Resume Builder
- AI-powered resume tailoring for specific job applications
- Cover letter generation based on job description
- Resume text parsing and management
- Download as text files

### 📊 Analytics & Insights
- Jobs by source distribution charts
- Match score distribution analysis
- Application pipeline visualization
- Skills gap analysis
- Top companies breakdown & salary analytics

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | ![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js) (App Router) |
| Language | ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) |
| Styling | ![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss) + shadcn/ui |
| Database | ![SQLite](https://img.shields.io/badge/SQLite-Prisma-003B57?logo=sqlite) |
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
git clone https://github.com/alokgarg003/careerforge.git
cd careerforge

# Install dependencies
bun install

# Set up environment
cp .env.example .env

# Initialize database
mkdir -p db
bun run db:push

# Seed with sample data (100+ companies, user profile)
bunx prisma db seed

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | SQLite database path | `file:./db/custom.db` |

---

## Architecture

### Job Search Pipeline
```
User Query → Strategy Selection → API/Scraper/AI → Results → Deduplication → Store → Display
```

### Match Scoring Algorithm
```
Job Description
    ├── Primary Skills Match      (60 pts max)
    ├── Secondary Skills Match    (15 pts max)
    ├── Bonus Signals:
    │   ├── MFT domain           (+10 pts)
    │   ├── On-call rotation     (+7 pts)
    │   ├── Cloud platforms      (+5 pts ×2)
    │   ├── ServiceNow/ITIL      (+8 pts)
    │   ├── CI/CD pipelines      (+4 pts)
    │   └── Support operations   (+6 pts)
    └── Penalties:
        ├── Dev-heavy role       (-30 pts)
        └── Exclusion keywords   (-30 pts)
    ═══════════════════════════════════
    = Total Score (0 - 100)
```

### Data Models (7 tables)
| Model | Purpose |
|-------|---------|
| **Profile** | User career profile with skills, preferences, salary range |
| **Company** | Target companies with career page URLs and search configs |
| **Job** | Discovered job listings from all sources |
| **JobMatch** | AI-powered match analysis and recommendations |
| **Application** | Kanban-style application tracking pipeline |
| **SavedSearch** | Reusable search configurations |
| **ActivityLog** | Action audit trail |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with sidebar
│   ├── page.tsx                # Main app shell
│   ├── globals.css             # Global styles
│   └── api/                    # 12 API routes
│       ├── dashboard/          # Dashboard statistics
│       ├── analytics/          # Analytics data
│       ├── profile/            # Profile CRUD
│       ├── jobs/               # Jobs + search + matching
│       ├── applications/       # Application tracking
│       ├── companies/          # Company management
│       ├── resume/             # Resume parsing & tailoring
│       └── activities/         # Activity logging
├── components/
│   ├── dashboard/              # Dashboard page
│   ├── jobs/                   # Job cards, list, detail drawer
│   ├── applications/           # Kanban tracker
│   ├── companies/              # Company cards & management
│   ├── analytics/              # Charts & analytics
│   ├── resume/                 # Resume builder
│   ├── settings/               # Settings page
│   └── ui/                     # 40+ shadcn/ui components
├── hooks/                      # Custom React hooks
└── lib/
    ├── db.ts                   # Prisma client
    ├── match-engine.ts         # Weighted scoring algorithm
    ├── types.ts                # TypeScript definitions
    └── utils.ts                # Utility functions
prisma/
├── schema.prisma               # Database schema (7 models)
└── seed.ts                     # Seed data (100+ companies)
```

---

## Screenshots

> The application features a modern dark/light theme dashboard with responsive design.

**Key Pages:**
- **Dashboard** — Pipeline overview with stats and activity feed
- **Jobs** — Multi-strategy search with AI-powered match scoring
- **Applications** — Kanban board with drag-and-drop pipeline
- **Companies** — 100+ target companies with career page configs
- **Analytics** — Interactive charts and data visualization
- **Resume** — AI-tailored resume and cover letter generation
- **Settings** — Profile management and data export

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

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](.github/PULL_REQUEST_TEMPLATE.md) for details.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Built with [Next.js](https://nextjs.org/), [shadcn/ui](https://ui.shadcn.com/), and [Prisma](https://www.prisma.io/)
- AI-powered search via [z-ai-web-dev-sdk](https://www.npmjs.com/package/z-ai-web-dev-sdk)
- Free job data from [Remotive](https://remotive.com/), [Jobicy](https://jobicy.com/), [Arbeitnow](https://arbeitnow.com/)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/alokgarg003">Alok Garg</a>
</p>
