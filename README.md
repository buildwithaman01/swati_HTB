# Swati Home Tuition Bureau - Management Portal & Website

Welcome to the **Swati Home Tuition Bureau** frontend and management system. This repository houses the entire digital infrastructure for Patna's leading home tuition bureau, connecting students with verified local teachers.

## 🔗 Live Links
- **Public Website:** [https://swatihometuition.in](https://swatihometuition.in)
- **Teacher Join Wizard:** [https://swatihometuition.in/join](https://swatihometuition.in/join)
- **Find Tutor:** [https://swatihometuition.in/find-tutor](https://swatihometuition.in/find-tutor)
- **Admin Dashboard:** [https://swatihometuition.in/admin/dashboard](https://swatihometuition.in/admin/dashboard) (Protected)
- **Parent/Student Portal:** [https://swatihometuition.in/portal/dashboard](https://swatihometuition.in/portal/dashboard) (Protected)
- **Teacher Portal:** [https://swatihometuition.in/teacher/dashboard](https://swatihometuition.in/teacher/dashboard) (Protected)

---

## 🏗 Technical Architecture

This project is built using modern web technologies focused on performance, SEO, and robust data management.

### Tech Stack
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router, Server Actions, API Routes)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Framer Motion (for animations)
- **Authentication:** Supabase Auth (Email/Password & Magic Links)
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel

### Data Synchronization & Integrations
This project utilizes a **4-Way Data Sync Architecture** to prevent data silos:
1. **Supabase (Primary DB):** Holds the operational data (users, auth, assignments, sessions, portal access).
2. **Vtiger CRM:** The master CRM for lead management. When a parent requests a tutor on the website, the lead is directly pushed to Vtiger via a custom API endpoint (`create_lead_api.php`) AND a bidirectional webhook keeps Supabase in sync.
3. **Google Sheets:** Used as a master KYC and data log. The Teacher Onboarding Wizard streams all 20+ KYC fields (including references and Aadhaar data) directly to a Google Sheets webhook.
4. **Email / WhatsApp Notifications:** 
   - Uses **Web3Forms** for instant, beautifully formatted HTML email delivery to the admin.
   - Generates instant deep-link WhatsApp messages (`https://wa.me/...`) for instant admin notification.

---

## 🚀 Key Workflows

### 1. Teacher Onboarding (3-Step Wizard)
- **Endpoint:** `/join`
- **Process:** Teachers go through a rigorous 3-step KYC wizard (Personal Details, Professional Profile, Verification & References).
- **Security:** Built-in anti-bypass agreements. Parent contact numbers are strictly masked on the teacher dashboard to enforce bureau policies.

### 2. Parent Lead Capture
- **Endpoint:** `/find-tutor`
- **Process:** High-conversion, friction-less 1-step form. 
- **Routing:** Immediately routes the data to Vtiger CRM (as a Lead), Supabase (as an Enquiry), and triggers email/WhatsApp alerts.

### 3. Dedicated Portals
- **Admin Panel:** Complete overview of teachers, students, assignments, and sessions. Admins can verify teachers and enroll students.
- **Teacher Portal:** Teachers can view their active assignments, log sessions, and track their monthly progress. Parent contact details are masked; teachers must contact the bureau.
- **Parent Portal:** Parents can view assigned teachers, track logged sessions, and view payment/fee schedules.

---

## 💻 Developer Setup

If you wish to run this project locally, follow these steps:

### 1. Clone the repository
```bash
git clone git@github.com:buildwithaman01/swati-htb-frontend.git
cd swati-htb-frontend
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add the following keys. (You will need to get these values from your Supabase and Web3Forms dashboards).

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Forms & Notifications
WEB3FORMS_KEY=your_web3forms_key
GOOGLE_SHEET_WEBHOOK_URL=your_google_apps_script_url
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Repository Structure
- `/app` - Next.js App Router (Pages, Layouts, API Routes)
  - `/(main)` - Public-facing website pages (Home, About, Join, Find Tutor)
  - `/admin` - Admin Dashboard
  - `/portal` - Parent/Student Dashboard
  - `/teacher` - Teacher Dashboard
  - `/api` - Backend API Routes and Webhooks
- `/components` - Reusable UI components (Navbar, Footer, Forms, Cards)
- `/utils` - Utility functions (Supabase clients, formatting, helpers)
- `/public` - Static assets (Images, Icons)

---

## 🔒 Security & Data Integrity
- **Server Actions:** All critical database mutations occur securely on the server via Next.js Server Actions.
- **Row Level Security (RLS):** Supabase RLS ensures teachers and parents can only view data assigned specifically to their `auth_user_id`.
- **Collation Constraints:** The system respects Vtiger's strict `utf8` character encoding to prevent database sync crashes.

Developed by [BuildWithAman](https://github.com/buildwithaman01).
