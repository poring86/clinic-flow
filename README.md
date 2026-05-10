# Clic Flow

A full-stack clinic management system for scheduling appointments, managing doctors and patients, tracking revenue, and handling subscriptions.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Frontend Pages](#frontend-pages)
- [API Client Generation (Orval)](#api-client-generation-orval)

---

## Overview

Clic Flow is a SaaS platform designed for medical clinics. It allows clinic owners to:

- Register and manage **doctors** with availability windows and appointment pricing.
- Register and manage **patients** with contact and demographic data.
- Schedule **appointments** between doctors and patients with real-time availability checking.
- View a **dashboard** with revenue, appointment volume, top doctors, and specialty breakdowns.
- Manage a **subscription plan** (Stripe integration).
- Authenticate securely with **email/password sessions**.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Browser / User                       │
└───────────────────────────┬─────────────────────────────┘
                            │ HTTP (port 3001)
                            ▼
┌─────────────────────────────────────────────────────────┐
│               Frontend  (Next.js 15 / App Router)        │
│                                                          │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────┐  │
│  │  /auth/*     │  │  /dashboard   │  │  /doctors    │  │
│  │  Login/Reg   │  │  Stats/Charts │  │  CRUD        │  │
│  └──────────────┘  └───────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────┐  │
│  │  /patients   │  │ /appointments │  │ /subscription│  │
│  │  CRUD        │  │  Schedule     │  │  Stripe      │  │
│  └──────────────┘  └───────────────┘  └──────────────┘  │
│                                                          │
│  Server Actions (next-safe-action) ──► REST API calls    │
│  React Query  ◄──────────────────────── Orval client     │
└───────────────────────────┬─────────────────────────────┘
                            │ HTTP (port 3000, internal: http://backend:3000)
                            ▼
┌─────────────────────────────────────────────────────────┐
│               Backend  (NestJS)                          │
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │  /auth   │ │ /doctor  │ │ /patient │ │/appointment│  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │
│  ┌──────────┐ ┌──────────┐                              │
│  │  /clinic │ │  /stripe │                              │
│  └──────────┘ └──────────┘                              │
│                                                          │
│  Drizzle ORM  ──────────────────────────► PostgreSQL     │
│  Swagger/OpenAPI ──► auto-exposed at /api                │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  PostgreSQL 16                            │
│            (Docker volume: postgres_data)                │
└─────────────────────────────────────────────────────────┘
```

### Frontend Architecture Standard (MVVM + Vertical Slice)

The frontend follows a strict **MVVM** architecture combined with **Vertical Slices** to keep the codebase predictable and scalable as the project grows.

#### Feature structure

Each domain feature (appointments, doctors, patients, dashboard) is organized under:

```
frontend/src/features/<feature>/
├── pages/          # Feature page/container
├── components/     # View layer (UI rendering)
├── hooks/          # ViewModel layer (state/commands/orchestration)
├── services/       # Business rules + API integration
├── mappers/        # DTO ↔ domain transformation
├── contracts/      # Stable internal types/interfaces
├── query-keys.ts   # Centralized React Query keys
└── index.ts        # Feature public exports
```

#### Layer responsibilities

- **View (`components/`)**: renders UI and receives data/actions via props.
- **ViewModel (`hooks/`)**: orchestrates state, async flows, mutation/query side effects.
- **Service (`services/`)**: executes business logic and API access with no UI concerns.
- **Mapper (`mappers/`)**: converts API DTOs to internal domain shapes and back.

#### Route integration rule

App Router entries under `frontend/src/app/(protected)/<route>/page.tsx` stay thin and delegate feature behavior to `features/<feature>/pages/*`.

This keeps routing concerns isolated from business/presentation layers and enforces consistency across all protected modules.

#### Why this matters for a public repository

- Easier onboarding for contributors.
- Lower coupling and safer refactors.
- Clear ownership boundaries for tests and reviews.
- Consistent implementation standard across all features.

For the complete convention and examples, see `frontend/ARCHITECTURE.md`.

### Request flow for a protected page

```
Browser
  │
  ├─► GET /dashboard   (Next.js Server Component)
  │       │
  │       ├─► getServerSession()  ──► GET /auth/session  ──► Backend ──► DB
  │       │
  │       └─► getDashboard()  ──► internal fetch  ──► Backend ──► DB
  │
  └─► returns rendered HTML + hydrated React Query cache
```

---

## Tech Stack

| Layer      | Technology                                                      |
|------------|-----------------------------------------------------------------|
| Frontend   | Next.js 15 (App Router), React 19, TypeScript                   |
| Styling    | Tailwind CSS 4, shadcn/ui, Radix UI primitives                  |
| Forms      | React Hook Form + Zod validation                                |
| Data fetch | TanStack React Query v5, Server Actions (next-safe-action)      |
| API types  | Orval (auto-generated from OpenAPI spec)                        |
| Backend    | NestJS 11, TypeScript                                           |
| ORM        | Drizzle ORM (Node.js PostgreSQL driver)                         |
| Database   | PostgreSQL 16                                                   |
| Auth       | Custom session-based auth (bcryptjs + UUID tokens)              |
| Payments   | Stripe                                                          |
| Container  | Docker + Docker Compose                                         |

---

## Project Structure

```
doutor-agenda/
├── docker-compose.yml
│
├── backend/                        # NestJS API
│   └── src/
│       ├── main.ts                 # Bootstrap + Swagger setup
│       ├── app.module.ts           # Root module
│       ├── db/
│       │   ├── index.ts            # Drizzle instance
│       │   └── schema.ts           # All table definitions
│       ├── auth/                   # Register / Login / Session
│       ├── clinic/                 # Clinic management
│       ├── doctor/                 # Doctor management
│       ├── patient/                # Patient management
│       ├── appointment/            # Appointment scheduling
│       └── stripe/                 # Stripe webhooks / checkout
│
└── frontend/                       # Next.js application
    └── src/
        ├── app/
        │   ├── authentication/     # Login & Register page
        │   ├── (protected)/        # Auth-guarded routes
        │   │   ├── dashboard/      # Analytics & metrics
        │   │   ├── doctors/        # Doctor list & forms
        │   │   ├── patients/       # Patient list & forms
        │   │   ├── appointments/   # Appointment list & forms
        │   │   ├── clinic-form/    # Clinic setup
        │   │   └── subscription/   # Stripe subscription
        │   └── api/                # Next.js route handlers
        ├── actions/                # Server Actions
        │   ├── create-appointment/
        │   ├── create-clinic/
        │   ├── create-stripe-checkout/
        │   ├── delete-appointment/
        │   ├── delete-doctor/
        │   ├── delete-patient/
        │   ├── get-avaiables-times/
        │   ├── upsert-doctor/
        │   └── upsert-patient/
        ├── api/
        │   ├── generated/          # Orval-generated React Query hooks
        │   └── schemas/            # Orval-generated TypeScript types
        ├── components/ui/          # shadcn/ui components
        ├── data/                   # Server-side data fetchers
        ├── helpers/                # currency, time formatters
        ├── hooks/                  # Custom React hooks
        └── lib/                    # auth client, safe-action, api URL
```

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose

### Running locally

```bash
# Clone the repository
git clone <repo-url>
cd doutor-agenda

# Start all services (db + backend + frontend)
docker compose up
```

| Service  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:3001        |
| Backend  | http://localhost:3000        |
| Swagger  | http://localhost:3000/api    |

### Regenerating the API client (Orval)

Run this after any change to backend endpoints or DTOs:

```bash
cd frontend
npx orval --config orval.config.js
```

---

## Environment Variables

### Backend

| Variable       | Description                          | Example                                          |
|----------------|--------------------------------------|--------------------------------------------------|
| `DATABASE_URL`  | PostgreSQL connection string         | `postgres://postgres:postgres@db:5432/doutor_agenda` |
| `PORT`          | Server port (optional, default 3000) | `3000`                                           |

### Frontend

| Variable               | Description                                        |
|------------------------|----------------------------------------------------|
| `API_URL`              | Internal backend URL (used on the server/SSR side) |
| `NEXT_PUBLIC_API_URL`  | Public backend URL (used in the browser)           |
| `DATABASE_URL`         | PostgreSQL connection string (for Drizzle/auth)    |

---

## Database Schema

```
users
 ├── id (PK)
 ├── name, email, emailVerified, image
 ├── createdAt, updatedAt
 └── ──< users_to_clinics

sessions
 ├── id (PK), token (unique)
 ├── userId (FK → users)
 └── expiresAt, createdAt, updatedAt

accounts
 ├── id (PK)
 ├── userId (FK → users)
 ├── providerId, accountId
 └── password (bcrypt hash for credentials)

clinics
 ├── id (PK, UUID)
 ├── name
 └── ──< doctors, patients, appointments, users_to_clinics

users_to_clinics
 ├── userId (FK → users)
 └── clinicId (FK → clinics)

doctors
 ├── id (PK, UUID)
 ├── clinicId (FK → clinics)
 ├── name, specialty, avatarImageUrl
 ├── availableFromWeekDay, availableToWeekDay  (0=Sun … 6=Sat)
 ├── availableFromTime, availableToTime        (HH:mm:ss)
 └── appointmentPriceInCents

patients
 ├── id (PK, UUID)
 ├── clinicId (FK → clinics)
 ├── name, email, phoneNumber
 └── sex  (enum: male | female)

appointments
 ├── id (PK, UUID)
 ├── clinicId  (FK → clinics)
 ├── patientId (FK → patients)
 ├── doctorId  (FK → doctors)
 ├── date (timestamp)
 └── appointmentPriceInCents
```

---

## API Endpoints

The full interactive spec is available at **http://localhost:3000/api** (Swagger UI).

### Auth — `/auth`

| Method | Path              | Description                         | Body                         |
|--------|-------------------|-------------------------------------|------------------------------|
| POST   | `/auth/register`  | Create a new user account           | `{ name, email, password }`  |
| POST   | `/auth/login`     | Authenticate and create a session   | `{ email, password }`        |
| GET    | `/auth/session`   | Get current user from session token | `?token=<token>`             |
| DELETE | `/auth/session`   | Invalidate a session                | `?token=<token>`             |

### Clinics — `/clinic`

| Method | Path      | Description          | Body              |
|--------|-----------|----------------------|-------------------|
| GET    | `/clinic` | List all clinics     | —                 |
| POST   | `/clinic` | Create a new clinic  | `{ name }`        |

### Doctors — `/doctor`

| Method | Path      | Description         | Body (`CreateDoctorDto`)                                                                 |
|--------|-----------|---------------------|------------------------------------------------------------------------------------------|
| GET    | `/doctor` | List all doctors    | —                                                                                        |
| POST   | `/doctor` | Create a new doctor | `{ clinicId, name, specialty, availableFromWeekDay, availableToWeekDay, availableFromTime, availableToTime, appointmentPriceInCents }` |

### Patients — `/patient`

| Method | Path           | Description            | Body (`CreatePatientDto` / `UpdatePatientDto`)          |
|--------|----------------|------------------------|----------------------------------------------------------|
| GET    | `/patient`     | List all patients      | —                                                        |
| POST   | `/patient`     | Create a new patient   | `{ name, email, phoneNumber, sex, clinicId }`            |
| PUT    | `/patient/:id` | Update a patient       | Partial of create body                                   |

### Appointments — `/appointment`

| Method | Path                | Description                | Body (`CreateAppointmentDto`)                                    |
|--------|---------------------|----------------------------|-----------------------------------------------------------------|
| GET    | `/appointment`      | List all appointments      | —                                                               |
| POST   | `/appointment`      | Create a new appointment   | `{ clinicId, patientId, doctorId, date, appointmentPriceInCents }` |
| DELETE | `/appointment/:id`  | Delete an appointment      | —                                                               |

---

## Frontend Pages

| Route                 | Access    | Description                                                    |
|-----------------------|-----------|----------------------------------------------------------------|
| `/authentication`     | Public    | Login and Register tabs                                        |
| `/dashboard`          | Protected | Revenue, appointment volume, top doctors, specialty chart      |
| `/doctors`            | Protected | Doctor card grid, add/edit/delete doctors, availability badges |
| `/patients`           | Protected | Patient table with search, add/edit/delete                     |
| `/appointments`       | Protected | Appointment table, schedule new appointments                   |
| `/clinic-form`        | Protected | Initial clinic setup after registration                        |
| `/subscription`       | Protected | Stripe subscription plan management                            |

---

## API Client Generation (Orval)

All TypeScript types and React Query hooks consumed by the frontend are **auto-generated** from the backend's OpenAPI spec. There are no manually maintained type files for API contracts.

```
Backend DTOs (with @ApiProperty)
        │
        ▼ NestJS Swagger
OpenAPI JSON  ──http://localhost:3000/api-json──►  Orval
        │
        ▼
frontend/src/api/
  ├── schemas/       ← TypeScript interfaces (DoctorDto, PatientDto, …)
  └── generated/     ← React Query hooks (useDoctorControllerFindAll, …)
```

To update the client after backend changes:

```bash
cd frontend && npx orval --config orval.config.js
```
