# Swati Home Tuition Bureau — Full-Stack Educational Platform & Management System

> **Client:** Swati Home Tuition Bureau (Patna, Bihar, India)  
> **Engineering & Architecture:** Developed and maintained by **Aman Singh** under **Pehchanly Digital Solutions**.  
> **Official Website:** [https://pehchanly.com/](https://pehchanly.com/)

---

## 📖 Overview

**Swati Home Tuition Bureau** (`swatihometuition.in`) is an enterprise-grade web application and multi-portal management system engineered for Patna's premier home tuition bureau. The platform coordinates verified in-home tutoring across 80+ localities in Patna, solving key operational challenges:

1. **Safety & Verification Deficit:** Implements an 8-Step Safety Shield protocol, digital Aadhaar KYC verification, and dynamic QR-coded Virtual ID Cards for in-person teacher validation.
2. **Female-First Student Matching:** Automatically prioritizes verified female educators for female students to guarantee peace of mind for families.
3. **Multi-Portal Architecture:** Unified access for Bureau Administrators, Verified Educators, and Enrolled Parents/Students with role-based access control.
4. **Programmatic Local SEO & AI Search Dominance:** 160 static SSG routes featuring localized schema, Google Maps integration, and content engineered for Google AI Overviews, Perplexity, and ChatGPT.

---

## 🌐 Live Application

- **Production URL:** [https://swatihometuition.in](https://swatihometuition.in)
- **Book a Free Demo:** [https://swatihometuition.in/book-demo](https://swatihometuition.in/book-demo)
- **Tutor Search Portal:** [https://swatihometuition.in/find-tutor](https://swatihometuition.in/find-tutor)
- **Teacher Onboarding Wizard:** [https://swatihometuition.in/join](https://swatihometuition.in/join)
- **Public Teacher Verification:** [https://swatihometuition.in/verify/TCH-2026-001](https://swatihometuition.in/verify/TCH-2026-001)
- **Admin Management Portal:** [https://swatihometuition.in/admin/dashboard](https://swatihometuition.in/admin/dashboard) *(Authenticated)*
- **Teacher Workspace:** [https://swatihometuition.in/teacher/dashboard](https://swatihometuition.in/teacher/dashboard) *(Authenticated)*
- **Parent & Student Portal:** [https://swatihometuition.in/portal/dashboard](https://swatihometuition.in/portal/dashboard) *(Authenticated)*

---

## 🛠 Technology Stack

### Frontend & Core Framework
- **Framework:** [Next.js 16 (Turbopack Engine)](https://nextjs.org/) with App Router, React Server Components (RSC), and Server Actions.
- **Language:** TypeScript 5 (Strict type safety).
- **UI & Styling:** Tailwind CSS 4, PostCSS, Lucide React (vector iconography).
- **Motion & Smooth UX:** Framer Motion, GSAP, Lenis Smooth Scroll.
- **Client Toast Notifications:** Sonner.

### Backend, Database & Infrastructure
- **Primary Database:** PostgreSQL via [Supabase](https://supabase.com/) with Row Level Security (RLS) and stored procedures (PL/pgSQL).
- **Authentication:** Supabase Auth (Magic Links, OAuth, and Email/Password sessions).
- **Object Storage:** Private Supabase Storage Bucket (`kyc-documents`) with 1-hour time-limited signed URLs for Aadhaar/PAN inspection.
- **Dual-Sync Pipeline:** Google Apps Script Webhooks (37-column Master Spreadsheet sync) & Vtiger CRM REST API.
- **Transactional Notifications:** Web3Forms API and 1-click WhatsApp deep-link generation (`wa.me`).
- **Hosting & Edge Infrastructure:** Vercel (Fluid Compute, Edge Caching, Daily Automated Keep-Alive Cron).

---

## ✨ Features

### 1. High-Conversion Lead Capture (`/book-demo`, `/find-tutor`)
- Smart Patna Locality Detector: Extracts and validates 80+ residential areas.
- Automated Data Routing: Concurrently pushes submissions to Supabase (`public.students`), Google Sheets, and triggers instant WhatsApp confirmation messages.
- Conflict Resolution: Seamlessly updates existing leads upon duplicate phone submissions (`23505`).

### 2. Multi-Step Teacher Onboarding & KYC (`/join`)
- 3-Phase Application Wizard: Collects personal credentials, academic specializations, serviceable zones, and KYC documents.
- Private Document Vault: Uploads identity proofs directly to encrypted, private storage (`public: false`), keeping government IDs inaccessible to unauthorized parties.
- Automated Bureau ID Generation: Sequentially issues official identification numbers (`TCH-2026-XXX`).

### 3. Digital Teacher ID Card & Public Verification (`/verify/[id]`)
- Dynamic SVG & HTML5 Canvas ID Card generation with real-time QR codes.
- Scan-to-Verify: Scanning the QR code directs parents to the live bureau verification page, confirming police verification, background status, and parent reviews.

### 4. Admin Operations Hub (`/admin`)
- Complete management of teachers, student leads, active assignments, and payment statuses.
- In-app KYC Inspector: Generates 1-hour secure signed URLs so administrators can audit Aadhaar documents without exposing public links.
- Financial Reporting: RPC-backed revenue metrics (`monthly_revenue_summary`).

### 5. Programmatic SEO & Generative Engine Optimization (GEO)
- **160 Static SSG Routes:** Hyper-localized landing pages for 80+ Patna neighborhoods (Boring Road, Kankarbagh, Patliputra, Bailey Road, etc.).
- **Rich Schema.org Graph:** Dual `LocalBusiness` + `EducationalOrganization` + `Service` + `BreadcrumbList` + `FAQPage` JSON-LD.
- **AI Crawler Optimization:** Root `public/llms.txt` and permissive `robots.txt` directives for Google-Extended, GPTBot, ClaudeBot, and PerplexityBot.

---

## 🏛 Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        NEXT.JS 16 CLIENT & EDGE                        │
│   Public App Router  │  Admin Portal  │  Teacher Portal  │  Parent App │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
          Server Actions / API              Encrypted Private
          (Bypasses RLS via Role)            Signed URLs (1 hr)
                    │                                │
                    ▼                                ▼
       ┌─────────────────────────┐      ┌─────────────────────────┐
       │   SUPABASE POSTGRESQL   │      │   SUPABASE S3 STORAGE   │
       │   • 8 Relational Tables │      │   • kyc-documents       │
       │   • Auto-ID Triggers    │      │   • public: false       │
       │   • RLS Access Control  │      │   • Encrypted ID Proofs │
       └────────────┬────────────┘      └─────────────────────────┘
                    │
                    ▼
     ┌─────────────────────────────────────────────────────────┐
     │                ASYNCHRONOUS DATA BUS                    │
     │  Google Apps Script (37-Col Master) │ Vtiger CRM Hook   │
     │  Web3Forms Transactional Email     │ WhatsApp Deep Link │
     └─────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
website/
├── app/
│   ├── (main)/                      # Public marketing & enrollment routes
│   │   ├── about/                   # About bureau & Swati's mission
│   │   ├── areas/                   # Programmatic local SEO directory
│   │   │   └── [area]/              # 80+ neighborhood SSG pages
│   │   ├── blogs/                   # Educational insights & blog hub
│   │   │   └── [slug]/              # 8 authoritative research articles
│   │   ├── book-demo/               # High-conversion demo request flow
│   │   ├── find-tutor/              # Search-by-subject enrollment
│   │   ├── join/                    # 3-step teacher onboarding wizard
│   │   ├── programs/                # JEE, NEET, CBSE, ICSE, Commerce
│   │   ├── safety/                  # 8-step safety shield protocol
│   │   └── verify/[id]/             # Public tutor verification endpoint
│   ├── admin/(dashboard)/           # Protected admin management suite
│   │   ├── assignments/             # Tutor-student pairing controller
│   │   ├── finance/                 # Payouts & fee ledger
│   │   ├── students/                # Student lead CRM
│   │   └── teachers/[id]/           # Teacher KYC approval & doc viewer
│   ├── api/
│   │   ├── health/                  # Automated DB keep-alive endpoint
│   │   ├── submit-form/             # Multi-target lead capture webhook
│   │   └── webhooks/vtiger/         # External CRM synchronization
│   ├── portal/                      # Parent & student self-service portal
│   ├── teacher/dashboard/           # Educator dashboard & ID card generator
│   ├── layout.tsx                   # Root layout, fonts & global JSON-LD
│   ├── robots.ts                    # Search & AI crawler directives
│   └── sitemap.ts                   # Dynamic XML sitemap generator
├── components/                      # Modular UI component library
│   ├── home/                        # Landing page sections & bento grids
│   └── seo/                         # Schema.org JSON-LD builders
├── lib/
│   ├── data/                        # Static datasets (areas, blogs)
│   └── supabase.ts                  # Client-side Supabase initialization
├── public/                          # Static brand assets & llms.txt
├── utils/supabase/                  # Server-side SSR Supabase clients
├── .env.example                     # Environment configuration template
├── next.config.ts                   # Next.js build configuration
├── package.json                     # Dependency manifests & metadata
├── tsconfig.json                    # TypeScript compiler configuration
└── vercel.json                      # Vercel daily keep-alive cron job
```

---

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js:** `v20.x` or higher
- **Package Manager:** `npm` (v10+) or `pnpm`
- **Database:** Supabase project (PostgreSQL 15+)

### 1. Clone the Repository
```bash
git clone git@github.com:buildwithaman01/swati-htb-frontend.git
cd swati-htb-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the example environment template and populate your credentials:
```bash
cp .env.example .env.local
```

---

## 🔐 Environment Variables

| Variable | Description | Exposure |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project endpoint URL | Public (Client/Server) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anonymous API key (enforces RLS) | Public (Client/Server) |
| `SUPABASE_SERVICE_ROLE_KEY` | Administrative secret key (bypasses RLS) | **Server Only (Strict)** |
| `WEB3FORMS_KEY` | Web3Forms transactional email API key | Server Only |
| `GOOGLE_SHEET_WEBHOOK_URL` | Apps Script deployment endpoint for backup | Server Only |

---

## 💻 Development & Build Commands

```bash
# Run local development server (with Turbopack)
npm run dev

# Run production build and generate static pages
npm run build

# Start production server locally
npm start

# Run ESLint code quality audit
npm run lint
```

---

## 🚀 Deployment

- **Hosting Platform:** [Vercel](https://vercel.com/)
- **DNS Configuration:** Apex domain `swatihometuition.in` and `www` CNAME routed to Vercel Anycast Edge.
- **Continuous Deployment:** Automated CI/CD pipeline triggered on every commit to `origin/main`.
- **Database Keep-Alive:** Daily automated cron configured in `vercel.json` executing `/api/health` to prevent Free-Tier inactivity auto-pausing.

---

## 🔒 Security & Data Protection

1. **Private Identity Storage:** Aadhaar and PAN documents are stored in a dedicated `kyc-documents` bucket set strictly to `public: false`. Public users cannot access or list these files.
2. **Signed URL Generation:** Administrators view identity documents via time-limited 1-hour signed URLs generated server-side.
3. **No Anonymous Table Mutations:** Direct anonymous `INSERT` policies are disabled. All lead submissions and teacher applications pass through server-side actions using `createAdminClient()`.
4. **Column-Level Public Security:** Anonymous users querying public teacher profiles are restricted to non-sensitive fields (`name`, `locality`, `subjects`, `rating`). Sensitive contact numbers, home addresses, and government identification numbers are revoked from public read access.

---

## 👨‍💻 Developer & Attribution

- **Lead Software Engineer:** Aman Singh
- **Architecture & Development:** [Pehchanly Digital Solutions](https://pehchanly.com/)
- **Company Website:** [https://pehchanly.com/](https://pehchanly.com/)
- **Founder & Owner:** Aman Singh
- **Engineering Inquiries:** Contact via [Pehchanly Digital Solutions](https://pehchanly.com/)

---

## 📄 License

This software and its proprietary architecture are developed for **Swati Home Tuition Bureau**. All rights reserved.
