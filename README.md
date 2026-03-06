### 📄 Resume Builder

A high-performance, type-safe web application designed to help users build, manage, and export professional resumes. This project leverages the modern **T3 Stack** and **Supabase** for a seamless, scalable, and responsive experience.

---

### 🛠️ Tech Stack

| Layer | Technology |
| --- | --- |
| **Framework** | [Next.js](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL) |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team/) |
| **API** | [tRPC](https://trpc.io/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/) |

---

### ✨ Features

* **Real-time Synchronization**: Instant database updates via tRPC and Drizzle ORM.
* **Secure Authentication**: Robust user management and session handling via Supabase Auth.
* **Data Integrity**: Strictly typed schema definitions using Zod for both client and server validation.
* **Dynamic JSONB Storage**: Flexible storage for complex resume sections (skills, experience, projects) within a relational PostgreSQL structure.
* **Responsive UI**: Optimized for all devices with a focus on modern, clean design patterns.

---

### 🚀 Getting Started

#### 1. Setup Environment Variables

Create a `.env` file in the root directory and configure your database and Supabase keys:

```env
# Database connection (via Transaction Pooler)
DATABASE_URL="postgresql://postgres:[ID]:[PASS]@[HOST]:6543/postgres?sslmode=require&supavisor=true"

# Supabase Auth & Storage
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

```

#### 2. Install & Run

```bash
# Install dependencies
npm install

# Push database schema
npm run db:push

# Start the development server
npm run dev

```

---

### 📂 Architecture Overview

```text
├── src/
│   ├── app/            # Next.js App Router (Pages & Layouts)
│   ├── components/     # UI Components (Shadcn)
│   ├── env.js          # Type-safe environment variable validation
│   ├── server/
│   │   ├── api/        # tRPC root and sub-routers
│   │   └── db/         # Drizzle schema & database client
│   └── utils/          # Shared helper functions & Supabase clients
└── drizzle.config.ts   # Database migration and filter settings

```

---

### 🛡️ Security & Performance

* **Transactional Pooling**: Configured for serverless environments using Port 6543 to prevent connection exhaustion.
* **Row Level Security (RLS)**: Database-level policies ensure users can only access their own resume data.
* **Hydration Helpers**: Optimized server-side prefetching to eliminate client-side loading flickers.

---

### 📄 License

This project is open-source and available under the **MIT License**.

---

**Would you like me to generate a specific "Features" section that details how the PDF generation or the ATS-optimization works?**
