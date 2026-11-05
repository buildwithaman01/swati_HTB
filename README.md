<div align="center">

# 🎓 Swati Home Tuition Bureau — Full-Stack Educational Platform & Management Suite

**Production-grade, high-performance web platform, multi-portal bureau management suite, and programmatic Local SEO engine built for Patna’s premier home tuition bureau.**

[![Next.js](https://img.shields.io/badge/Next.js-16.3.0_(Turbopack)-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0_(Strict)-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_&_Auth-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![SEO](https://img.shields.io/badge/SEO-100%2F100_Engineered-orange?style=for-the-badge)](https://swatihometuition.in)

[🌐 View Live Site](https://swatihometuition.in) • [💼 Agency: Pehchanly](https://pehchanly.com) • [👨‍💻 Developer Portfolio](https://github.com/buildwithaman01)

</div>

---

## 📌 Executive Summary

**Swati Home Tuition Bureau** (`swatihometuition.in`) is an enterprise-grade full-stack web application and multi-portal operational suite engineered for Patna's leading home tuition bureau. Operating across **90+ localities in Patna, Bihar**, the platform solves the foundational challenges in localized offline tutoring:

1. **Safety & Verification Deficit:** Enforces an **8-Step Safety Shield**, verified Aadhaar identity verification, and dynamic QR-coded Virtual ID Cards for in-person educator validation before home entry.
2. **Female-First Student Matching:** Automatically prioritizes verified female educators for female students to guarantee peace of mind for families.
3. **Multi-Portal Operational Suite:** Dedicated role-based portals for **Bureau Administrators**, **Verified Tutors**, and **Enrolled Parents/Students**.
4. **Social-Style Profiles & Academic Tracking:** Facebook/LinkedIn-style profile customization with live photo uploads, academic marks, test score cards, and 1-click WhatsApp progress sharing.
5. **Class Attendance & Session Logging:** Live session recording with start/end duration, topics covered, homework assigned, and automated parent WhatsApp notifications.
6. **Programmatic Local SEO Engine (90+ Nodes):** Pre-rendered static landing pages across all 90+ Patna neighborhoods with localized schema, landmark mapping, and AI search (ChatGPT, Claude, Perplexity) optimization.

---

## 🌐 Live Production Links

* **Live Platform:** [https://swatihometuition.in](https://swatihometuition.in)
* **Book a Free Demo:** [https://swatihometuition.in/book-demo](https://swatihometuition.in/book-demo)
* **Tutor Search Hub:** [https://swatihometuition.in/find-tutor](https://swatihometuition.in/find-tutor)
* **Teacher Onboarding Wizard:** [https://swatihometuition.in/join](https://swatihometuition.in/join)
* **Public Tutor Verification:** [https://swatihometuition.in/verify/TCH-2026-619](https://swatihometuition.in/verify/TCH-2026-619)
* **Admin Management Hub:** [https://swatihometuition.in/admin/dashboard](https://swatihometuition.in/admin/dashboard) *(Role Protected)*
* **Teacher Workspace:** [https://swatihometuition.in/teacher/dashboard](https://swatihometuition.in/teacher/dashboard) *(Authenticated)*
* **Parent & Student Portal:** [https://swatihometuition.in/portal/dashboard](https://swatihometuition.in/portal/dashboard) *(Authenticated)*

---

## 🏗️ Architecture & System Topology

```
                                  ┌───────────────────────────┐
                                  │   Next.js 16 App Router   │
                                  │   (Turbopack Engine)      │
                                  └─────────────┬─────────────┘
                                                │
         ┌──────────────────────────────┬───────┴──────────────────────┬──────────────────────────────┐
         ▼                              ▼                              ▼                              ▼
┌─────────────────┐           ┌──────────────────┐           ┌──────────────────┐           ┌──────────────────┐
│ Public & Lead   │           │ Admin Management │           │ Teacher & Student│           │ Programmatic SEO │
│ Engine (SSG)    │           │ Suite (RLS Role) │           │ Portals & Tests  │           │ 90+ Localities   │
│ • /book-demo    │           │ • /admin/teachers│           │ • /teacher/*     │           │ • /areas/[slug]  │
│ • /find-tutor   │           │ • /admin/students│           │ • /portal/*      │           │ • /blogs/[slug]  │
│ • /join wizard  │           │ • /admin/assign  │           │ • Tests & Marks  │           │ • Schema JSON-LD │
└────────┬────────┘           └────────┬─────────┘           └────────┬─────────┘           └────────┬─────────┘
         │                             │                              │                              │
         └─────────────────────────────┼──────────────────────────────┴──────────────────────────────┘
                                       │
                      ┌────────────────┴────────────────┐
                      ▼                                 ▼
         ┌─────────────────────────┐       ┌─────────────────────────┐
         │   SUPABASE POSTGRESQL   │       │   SUPABASE S3 STORAGE   │
         │   • 8 Relational Tables │       │   • kyc-documents       │
         │   • Row Level Security  │       │   • Signed URL Proxy    │
         │   • Triggers & Sequences│       │   • Secure Doc Viewer   │
         └────────────┬────────────┘       └─────────────────────────┘
                      │
                      ▼
         ┌─────────────────────────────────────────────────────────┐
         │                ASYNCHRONOUS DATA BUS                    │
         │  Google Apps Script (37-Col Master) │ Vtiger CRM Webhook│
         │  Web3Forms Transactional Email     │ WhatsApp Deep Link │
         └─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16 (Turbopack Engine)](https://nextjs.org/) | App Router, Server Components (RSC), Server Actions, Dynamic SSG |
| **Frontend Core** | [React 19](https://react.dev/) + [TypeScript 5](https://www.typescriptlang.org/) | Strict type safety, high-fidelity state management |
| **Design System** | [Tailwind CSS v4](https://tailwindcss.com/) + PostCSS | Modern utility-first CSS variables architecture |
| **Vector Icons** | [Lucide React](https://lucide.dev/) | Clean, accessible iconography |
| **Motion** | Framer Motion & GSAP 3 | Smooth kinetic page transitions and entrance animations |
| **Database & Auth** | [Supabase PostgreSQL](https://supabase.com/) | 8 relational tables, Row Level Security (RLS), Auth sessions |
| **Document Vault** | Supabase Storage (Private) | Encrypted Aadhaar KYC storage with on-the-fly HMAC signed URLs |
| **Dual Data Bus** | Google Apps Script + Vtiger CRM | 37-column master spreadsheet ingestion & CRM lead tracking |
| **Notifications** | Web3Forms & WhatsApp API (`wa.me`) | Instant transactional parent/teacher notification deep links |
| **Hosting** | [Vercel](https://vercel.com/) | Global Edge network, zero-cold-start compute, automated health cron |

---

## 📈 Quality & Engineering Benchmarks

| Metric | Target | Result | Status |
| :--- | :--- | :--- | :--- |
| **Turbopack Build** | Zero Errors | 153 static and dynamic routes compiled cleanly | ✅ 100% Clean |
| **TypeScript Strictness** | Zero `any` leaks | Strict type checking on all models and API handlers | ✅ Verified |
| **Security Architecture** | Zero Anon Mutations | All database writes secured via service-role Server Actions | ✅ Hardened |
| **Storage Privacy** | Private Bucket | KYC Aadhaar storage private with HMAC signed links | ✅ Secure |
| **SEO Indexation** | Full Patna Coverage | 90+ programmatic locality pages + dynamic XML sitemap | ✅ Optimized |
| **Generative AI Search (GEO)**| Citation Ready | `public/llms.txt` + JSON-LD Knowledge Graph validated | ✅ Validated |

---

## 📂 Project Structure

```bash
website/
├── app/
│   ├── (main)/                      # Public marketing, program & enrollment routes
│   │   ├── about/                   # Bureau heritage & safety mission
│   │   ├── areas/                   # Programmatic local SEO directory
│   │   │   └── [area]/              # 90+ neighborhood SSG pages with LocalBusiness schema
│   │   ├── blogs/                   # Educational research & parent guidance
│   │   │   └── [slug]/              # In-depth SEO articles with BlogPosting schema
│   │   ├── book-demo/               # High-conversion demo request funnel
│   │   ├── find-tutor/              # Search-by-subject enrollment engine
│   │   ├── join/                    # 3-step teacher application wizard with KYC upload
│   │   ├── programs/                # CBSE, ICSE, JEE, NEET, Foundation & Commerce
│   │   ├── safety/                  # 8-step safety shield protocol & female-first policy
│   │   └── verify/[id]/             # Public tutor verification endpoint & QR target
│   ├── admin/(dashboard)/           # Protected admin management suite
│   │   ├── assignments/             # Tuition pairing controller (New, Split, WhatsApp dispatch)
│   │   ├── finance/                 # Payouts & fee ledger
│   │   ├── reports/                 # Central monthly reports audit
│   │   ├── students/[id]/           # Student lead CRM & status management
│   │   └── teachers/[id]/           # Teacher KYC approval, document viewer & status controller
│   ├── api/
│   │   ├── admin/                   # Admin endpoints (assignments, update-teacher, update-student)
│   │   ├── docs/view/               # Universal signed KYC document viewer proxy
│   │   ├── student/update-profile/  # Student academic marks & target exam handler
│   │   ├── submit-form/             # Multi-target lead capture webhook (Supabase, Sheet, WhatsApp)
│   │   ├── teacher/tests/           # Teacher student assessment & marks logger
│   │   ├── teacher/update-profile/  # Teacher social profile & academic details handler
│   │   └── upload/photo/            # Client-side photo upload engine with base64 fallback
│   ├── portal/(dashboard)/          # Parent & student self-service portal
│   │   ├── profile/                 # Student profile & school marks editor
│   │   ├── reports/                 # Verified test score cards & printable PDF reports
│   │   └── sessions/                # Attendance history, study hours & topic log
│   ├── teacher/dashboard/           # Educator workspace
│   │   ├── id-card/                 # Dynamic Virtual ID Card with QR & photo sync
│   │   ├── profile/                 # Facebook/LinkedIn-style profile editor
│   │   ├── sessions/                # Class logger with duration & 1-click WhatsApp update
│   │   └── tests/                   # Test assessment creator with automatic grading
│   ├── layout.tsx                   # Root layout, fonts & global JSON-LD Knowledge Graph
│   ├── robots.ts                    # Search & AI crawler directives (GPTBot, ClaudeBot, Perplexity)
│   └── sitemap.ts                   # Dynamic XML sitemap generator (90+ areas, blogs, programs)
├── components/                      # Modular UI component library
│   ├── home/                        # Hero, Pillars, Stats, Testimonials, FAQ components
│   └── layout/                      # Header, Footer (attributions), Mobile Navigation
├── lib/
│   ├── data/                        # Static datasets (areas.ts with 90+ nodes, blogs.ts)
│   └── supabase.ts                  # Client-side Supabase initialization
├── public/                          # Static brand assets, favicons & llms.txt
└── utils/supabase/                  # Server-side SSR Supabase clients (createClient, createAdminClient)
```

---

## ⚙️ Installation & Development

### Prerequisites
- **Node.js:** `v20.x` or higher
- **Package Manager:** `npm` (v10+) or `pnpm`
- **Database:** Supabase project (PostgreSQL 15+)

### 1. Clone & Install
```bash
git clone git@github.com:buildwithaman01/swati-htb-frontend.git
cd swati-htb-frontend
npm install
```

### 2. Configure Environment Variables
Create `.env.local` with the following variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret
WEB3FORMS_KEY=your-web3forms-key
GOOGLE_SHEET_WEBHOOK_URL=your-apps-script-url
```

### 3. Build & Test Commands
```bash
# Run local development with Turbopack
npm run dev

# Run production build and generate static pages
npm run build

# Start production server
npm start
```

---

## 👨‍💻 Engineering Credits & Attribution

This enterprise platform was architected, engineered, and delivered by **Pehchanly Digital Solutions** under the technical leadership of **Aman Singh**.

* **Lead Full-Stack & DevOps Engineer:** **Aman Singh**
  * **GitHub:** [@buildwithaman01](https://github.com/buildwithaman01)
  * **Agency & Portfolio:** [Pehchanly Digital Solutions](https://pehchanly.com/)
  * **Email:** [contact@pehchanly.com](mailto:contact@pehchanly.com)
* **Client / Business:** **Swati Home Tuition Bureau**
  * **Location:** Patna, Bihar, India
  * **Official Website:** [https://swatihometuition.in](https://swatihometuition.in)
  * **Official Contact:** +91 92297 38307

---

<div align="center">
  <sub>Crafted with engineering precision by <a href="https://pehchanly.com"><b>Pehchanly Digital Solutions</b></a> & <a href="https://github.com/buildwithaman01"><b>Aman Singh</b></a>.</sub>
</div>
