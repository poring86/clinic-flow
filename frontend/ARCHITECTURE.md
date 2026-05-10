# Architecture Pattern: MVVM with Vertical Slices

This document describes the architectural pattern used in the Clic Flow frontend for better code organization, scalability, and maintainability.

## Pattern Overview

We use a **MVVM (Model-View-ViewModel)** pattern combined with **Vertical Slice** organization. This approach separates concerns while keeping related code close together by domain/feature.

## Structure per Feature

Each feature (e.g., `appointments`, `doctors`, `patients`) is organized as follows:

```
src/features/<feature>/
├── pages/
│   └── <feature>-page.tsx          # Main container/page component (renders UI + state)
├── components/
│   ├── <specific>-form.tsx         # UI components (dumb, only render)
│   ├── <specific>-button.tsx       # UI components
│   ├── <specific>-table.tsx        # UI components
│   └── ...
├── hooks/
│   ├── use-<feature>-view-model.ts # ViewModel hook (state + commands)
│   └── ...
├── services/
│   └── <feature>-service.ts        # Business logic + API calls
├── mappers/
│   └── to-<dto>.ts                 # Transform DTO ↔ domain model
├── contracts/
│   └── <feature>-*.ts              # Type definitions (stable interfaces)
├── query-keys.ts                   # React Query key factory
├── index.ts                        # Barrel export
└── ...
```

## Layer Responsibilities

### View Layer (Components)
- **File**: `components/*.tsx`
- **Responsibility**: Render UI only. No business logic.
- **Access**: Gets props from ViewModel hook.
- **Examples**:
  - `AddAppointmentForm` - form UI with validation
  - `AppointmentsList` - table UI
  - `AddButton` - button UI

### ViewModel Layer (Hooks)
- **File**: `hooks/use-*-view-model.ts`
- **Responsibility**: Orchestrate state, commands, side effects. React-specific logic.
- **Access**: Uses services, handles toast/navigation, invalidates queries.
- **Export**: `{ isPending, submit, error, onSuccess, ... }`
- **Example**:
  ```typescript
  const useCreateAppointmentViewModel = ({ clinicId, onSuccess }) => {
    const mutation = useMutation({
      mutationFn: (values) => createAppointmentService({ clinicId, values }),
      onSuccess: () => {
        toast.success("Created");
        onSuccess?.();
        queryClient.invalidateQueries(appointmentsQueryKeys.list(clinicId));
      },
    });
    return { isPending: mutation.isPending, submit: mutation.mutate };
  };
  ```

### Service Layer
- **File**: `services/<feature>-service.ts`
- **Responsibility**: Business logic + API integration. No React, no toast.
- **Access**: Uses API clients (fetch, Orval), mappers.
- **Export**: Pure functions that return data or throw errors.
- **Example**:
  ```typescript
  export const createAppointmentService = async (command) => {
    const payload = toCreateAppointmentDto(command);
    const response = await fetch(`${getApiBaseUrl()}/appointment`, { ... });
    if (!response.ok) throw new Error(...);
    return response.json();
  };
  ```

### Mapper Layer
- **File**: `mappers/to-*.ts`
- **Responsibility**: Transform between DTO (from API) and domain model (internal).
- **Access**: Takes Orval DTO as input, returns internal contract.
- **Example**:
  ```typescript
  export const toCreateAppointmentDto = (command) => ({
    clinicId: command.clinicId,
    date: dayjs(command.date).toISOString(),
    appointmentPriceInCents: Math.round(command.price * 100),
  });
  ```

### Contract Layer
- **File**: `contracts/<feature>-*.ts`
- **Responsibility**: Type definitions for the feature. Stable, internal interfaces.
- **Examples**:
  - `CreateAppointmentFormValues` - what form accepts
  - `CreateAppointmentCommand` - what service receives
  - `AppointmentViewModel` - what hook returns

### Query Keys
- **File**: `query-keys.ts`
- **Responsibility**: Centralized React Query key factory.
- **Export**: `{ list, detail, doctors, ... }`
- **Example**:
  ```typescript
  export const appointmentsQueryKeys = {
    list: (clinicId) => ["appointments", clinicId],
    doctors: (clinicId) => ["doctors", clinicId],
  };
  ```

## App Router Integration

The App Router (`src/app/(protected)/<feature>/page.tsx`) acts as a route-only entry point:

```typescript
// src/app/(protected)/appointments/page.tsx
import { AppointmentsPage } from "@/features/appointments";

const AppointmentsPageRoute = async () => {
  const session = await getServerSession();
  return (
    <PageContainer>
      <AppointmentsPage clinicId={session.clinicId} />
    </PageContainer>
  );
};
export default AppointmentsPageRoute;
```

### Route-Specific Components (`_components/`)

The `_components/` folder inside app routes contains **route-scoped components only**:
- **Page layout containers** (e.g., `SummaryContainer`) - orchestrate feature components
- **Route-only utilities** (e.g., `DatePicker`, `SignOutButton`)

These should NOT contain presentation logic—that belongs in `features/`.

Example:
```typescript
// src/app/(protected)/dashboard/_components/summary-container.tsx
import { SummaryCard } from "@/features/dashboard"; // ✅ imports from feature

export const SummaryContainer = ({ clinicId, from, to }) => (
  <SummaryCard clinicId={clinicId} from={from} to={to} />
);
```

## Dashboard Feature (Example: MVVM in Action)

The Dashboard demonstrates full MVVM pattern:

```
src/features/dashboard/
├── hooks/                           # ViewModel layer
│   ├── use-dashboard-summary-view-model.ts
│   ├── use-dashboard-top-doctors-view-model.ts
│   └── index.ts
├── components/                      # View layer + Cards
│   ├── summary-card.tsx             # "use client" card with ViewModel
│   ├── top-doctors-card.tsx
│   ├── appointments-chart.tsx       # Pure presentation component
│   ├── top-doctors.tsx              # Pure presentation component
│   ├── top-specialties.tsx          # Pure presentation component
│   └── index.ts (barrel export)
├── query-keys.ts                    # React Query centralized keys
├── index.ts                         # Public API
└── ...

src/app/(protected)/dashboard/
├── page.tsx                         # Server component → passes props to containers
└── _components/
    ├── summary-container.tsx        # Route orchestrator (renders SummaryCard)
    ├── appointments-chart-container.tsx
    ├── date-picker.tsx              # Route-only component
    └── sign-out-button.tsx          # Route-only component
```

### Pattern: Card Components + Containers

**Card Component** (in `features/dashboard/components/`):
```typescript
// "use client" - hooks into ViewModel
export const SummaryCard = ({ clinicId, from, to }) => {
  const { summary, isLoading, error } = useDashboardSummaryViewModel({
    clinicId, from, to
  });

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorState />;

  return <StatsCards {...summary} />;
};
```

**Container** (in `app/(protected)/dashboard/_components/`):
```typescript
// Simple wrapper - passes props from page
export const SummaryContainer = ({ clinicId, from, to }) => (
  <SummaryCard clinicId={clinicId} from={from} to={to} />
);
```

**Page** (in `app/(protected)/dashboard/`):
```typescript
// Server component - extracts session, passes props to containers
export default async function DashboardPage({ searchParams }) {
  const { from, to } = await searchParams;
  const { clinicId } = await getServerSession();

  return (
    <>
      <SummaryContainer clinicId={clinicId} from={from} to={to} />
      <AppointmentsChartContainer clinicId={clinicId} from={from} to={to} />
    </>
  );
}
```



## Key Rules

1. **View Components** never import:
   - `getApiBaseUrl`, `fetch`, or API clients
   - `useMutation`, `useQuery` directly
   - Services or mappers
   - Toast or navigation logic

2. **ViewModel Hooks** never import:
   - Components (no circular dependency)
   - UI library specifics (Button, Input) 

3. **Services** never import:
   - React hooks or components
   - Toast or router
   - UI-specific libraries

4. **Route-Specific Components** (`_components/`):
   - ✅ Import from `features/`
   - ✅ Wrap feature components for route orchestration
   - ✅ Can be route-only utilities (DatePicker, buttons tied to route)
   - ❌ Should NOT contain presentation logic
   - ❌ Should NOT contain ViewModel hooks (that goes in cards in `features/`)
   - ❌ Should NOT be duplicated in features—keep DRY

4. **Mappers** are pure functions (no side effects).

5. **Query Keys** are centralized and used everywhere to ensure consistency.

## Example Flow

User submits appointment form:

1. **View** → User clicks submit → calls `viewModel.submit(values)`
2. **ViewModel** → Calls `createAppointmentService(values)`
3. **Service** → Calls `toCreateAppointmentDto(values)` → fetches API
4. **Mapper** → Transforms form values to API DTO
5. **Back to ViewModel** → Handles success → shows toast → invalidates queries
6. **Back to View** → Loading state ends → modal closes

## Benefits

- **Testability**: Services are pure functions, easy to test.
- **Maintainability**: Each layer has a single responsibility.
- **Scalability**: New features follow the same pattern.
- **Isolation**: Changing UI doesn't affect business logic.
- **Reusability**: Services can be used by multiple features.

## Next Steps

Apply this pattern to:
- [ ] Doctors feature
- [ ] Patients feature
- [ ] Clinic feature

Use `src/features/appointments/` as a template.
