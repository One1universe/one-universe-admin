# One Universe Admin – Technical & Operational Handover

## 1. Overview

One Universe Admin is the internal administration panel for the One Universe platform. It is a React/Next.js 16 application that provides authenticated administrators with tools for:

- User management (admins, buyers, sellers)
- Payment and transaction monitoring
- Dispute management
- Service approval and moderation
- Promotional offers and referral program configuration
- Support tickets and feedback
- Platform-wide settings (fees, platform configuration, notifications)

The app communicates exclusively with the One Universe API backend; it does not talk directly to any database.

## 2. Architecture and Codebase Structure

### 2.1 Tech Stack
 
- Framework: Next.js 16 (App Router)
- Language: TypeScript
- UI and Styling:
  - Tailwind CSS 4
  - Radix UI components
  - Custom UI components under `src/components/ui`
  - Framer Motion for animations
  - Lucide React and React Icons for iconography
- State and Data:
  - NextAuth for authentication (Credentials provider, JWT sessions)
  - TanStack React Query for data fetching and caching
  - Zustand for client-side state management
- HTTP and APIs:
  - `fetch` plus a custom `HttpService`
  - Direct `fetch` or `axios` for some modules
  - Backend base URL:
    - Production: `https://one-universe-de5673cf0d65.herokuapp.com/api/v1`
    - Local: `http://localhost:8000/api/v1`
- Utilities and Other:
  - `date-fns` for date formatting
  - `jsPDF` plus `jspdf-autotable` and `file-saver` for export
  - `xlsx` for Excel exports
  - `react-hot-toast` for notifications

### 2.2 High-Level Architecture

- App router layouts:
  - `src/app/layout.tsx` – root layout and global providers
  - `src/app/auth/layout.tsx` – layout for auth routes
  - `src/app/admin/layout.tsx` – layout for admin routes (sidebar, header, and main content)

- Route groups:
  - `src/app/auth/*` – public authentication flows (sign-in, forgot and reset password, invite and setup, and related flows)
  - `src/app/admin/*` – authenticated admin views for each functional module
  - `src/app/api/*` – server-side API routes used by the frontend (NextAuth auth route, document download proxy, and similar)

- Supporting layers:
  - `src/services/*` – API client wrappers (per domain: payments, users, disputes, platform settings, and others)
  - `src/store/*` – Zustand stores managing module-wide UI and domain state
  - `src/react-query/*` – QueryClient configuration and React Query provider
  - `src/hooks/*` – custom hooks for data fetching and feature-specific logic
  - `src/data/layoutSidebarData.ts` – sidebar navigation and module mapping
  - `src/utils/*` – utilities such as permissions, booking status mapping, and date formatting

### 2.3 Key Directories

- `src/app/admin/`
  - `page.tsx` – Admin dashboard
  - Feature directories such as `booking-management`, `users-management`, `payment-management`, `dispute-management`, `service-management`, `promotional-offers`, `support`, and `settings` each contain a `page.tsx` file and supporting components (tables, filters, modals, and others).

- `src/services/`
  - `authService.ts` – login, logout, and password reset flows
  - `paymentService.ts` – payment listing and details
  - `serviceManagement.ts` – service approval and rejection flows
  - `platformSettingsService.ts`, `referralService.ts`, `sponsorAdsService.ts`, and others for specific domains
  - `baseUrl.ts` – backend base URL configuration
  - `httpService.ts` – reusable HTTP wrapper tied to NextAuth sessions

- `src/store/`
  - Per-module stores such as `userManagementStore.ts`, `paymentManagementStore.ts`, `disputeManagementStore.ts`, and `platformSettingsStore.ts`
  - `Permissionsstore.ts` – permissions and roles in client state
  - `useToastStore.ts`, `notificationStore.ts`, and related UI or notification stores

- `src/app/api/`
  - `auth/[...nextauth]/route.ts` – NextAuth credentials provider backed by the One Universe API
  - `admin/download-document/route.ts` – authenticated proxy for downloading files (for example, from Cloudinary)

## 3. Deployment and Environments

### 3.1 Repositories and Branching

- Frontend repository (this project):  
  `https://github.com/ReCreaX/one-universe-admin.git`
- Default branch: `main`

Access is managed via GitHub permissions. Ensure operations and development teams have at least read access to this repository.

The backend API is maintained in a separate repository and has its own operational handover. This admin panel assumes that the backend API is already deployed and stable.

### 3.2 Runtime and Build

- Node version: use an LTS version compatible with Next 16 (Node 18 or later is recommended).
- Install dependencies:

```bash
npm install
```

- Local development:

```bash
npm run dev
```

This runs the Next.js development server on `http://localhost:3000` using Turbopack.

- Production build and start:

```bash
npm run build
npm start
```

### 3.3 Environments

Typical environments (update with your actual URLs as needed):

- Local:
  - Frontend: `http://localhost:3000`
  - Backend API: `http://localhost:8000/api/v1`
  - Environment file: `.env.local` (ignored by git)

- Staging or UAT (example values, update to match your setup):
  - Frontend: `https://admin-staging.oneuniverse.com`
  - Backend API: staging API base URL configured via `NEXT_PUBLIC_API_URL`
  - Uses the same environment variable names as production, with staging-specific values.

- Production:
  - Frontend: for example, `https://admin.oneuniverse.com` (or the Vercel project URL)
  - Backend API: `https://one-universe-de5673cf0d65.herokuapp.com/api/v1`
  - Secrets are managed via the hosting provider’s environment settings.

## 4. Source Code Repositories and Access

### 4.1 Frontend (Admin Panel)

- Git remote:  
  `origin  https://github.com/ReCreaX/one-universe-admin.git`
- Default branch: `main`
- Permissions:
  - Developers: write access
  - Operations: read access and deployment privileges in CI or CD systems

### 4.2 Backend

The backend is not part of this repository. All data is served from the One Universe API (hosted on Heroku). Database configuration, migrations, and backend secrets (including database credentials) live in the backend project and its infrastructure.

## 5. Server and Hosting Information

### 5.1 Frontend Hosting

The admin panel is a standard Next.js application and can be hosted on:

- Vercel
- Any Node.js hosting environment (such as AWS, Azure, GCP, or an on-premises Node server)

Operational guidelines:

- Run `npm run build` during continuous integration.
- Serve the app using `npm start` or a platform-specific Next.js adapter.
- Ensure environment variables are correctly set for each deployment target (see the next section).

### 5.2 Backend API (One Universe API)

- Base URL (production): `https://one-universe-de5673cf0d65.herokuapp.com/api/v1`
- Base URL (local): `http://localhost:8000/api/v1`

These base URLs are used by:

- `authService.ts` via `NEXT_PUBLIC_API_URL` or a default value
- `paymentService.ts`, `serviceManagement.ts`, `platformSettingsService.ts`, and others using `getBaseUrl("live")`
- Various axios calls in user management and other modules

All business logic, database access, and authentication endpoints are implemented in this backend.

### 5.3 Internal Next.js API Routes

- `src/app/api/auth/[...nextauth]/route.ts`
  - NextAuth credentials provider.
  - Uses `/auth/login` and `/auth/refresh-token` on the backend API.

- `src/app/api/admin/download-document/route.ts`
  - Authenticated proxy for Cloudinary or other storage URLs.
  - Only allows URLs containing `cloudinary.com` as a security check.
  - Requires a valid NextAuth session (JWT) to download files.

## 6. Environment Variables and Database Configuration

### 6.1 Environment Variables (Frontend)

The admin panel uses the following environment variables:

- Authentication:
  - `NEXTAUTH_SECRET` – secret key used by NextAuth to sign or encrypt JWTs.
  - `NEXTAUTH_URL` – base URL for the deployed app (required by NextAuth in some hosting setups).

- Backend API:
  - `NEXT_PUBLIC_API_URL` – publicly exposed base URL for the One Universe API.  
    If this is not set, it defaults to `https://one-universe-de5673cf0d65.herokuapp.com/api/v1`.

- Platform Settings and Referral Program:
  - `NEXT_PUBLIC_PLATFORM_SETTINGS_ID` – ID used in platform settings (`PlatformChargesDashboard.tsx`) and referral program settings to fetch and update configuration records from the backend.

All `.env*` files are ignored by git. Secrets should never be committed to the repository.

### 6.2 Database Configuration and Credentials

The admin panel does not connect directly to any database. All data is retrieved via the One Universe API over HTTPS.

Database configuration, credentials, migration scripts, and read or write logic exist only in the backend service. For database-level operations or credentials:

- Refer to the backend’s infrastructure and DevOps handover documentation.
- Access database secrets via the backend’s hosting provider (for example, Heroku config variables or a managed secret store).

From the frontend perspective, the only configuration required is ensuring the correct API base URLs and environment variables are set per environment.

## 7. Third-Party Integrations

### 7.1 Authentication and Security

- NextAuth (credentials provider):
  - Auth route: `src/app/api/auth/[...nextauth]/route.ts`
  - Uses `/auth/login` on the backend API.
  - Stores `accessToken`, `refreshToken`, `permissions`, and `roles` in JWT and session.
  - Implements token refresh via `/auth/refresh-token` on the backend.

- JWT-based sessions:
  - Access and refresh tokens are managed by the backend.
  - The frontend uses these tokens to authorize requests to APIs.

### 7.2 Backend and Network

- One Universe API – main backend for all operations:
  - Authentication endpoints such as `/auth/login`, `/auth/forgot-password`, `/auth/verify`, `/auth/change-password`, and `/auth/refresh-token`
  - Admin endpoints for:
    - Users (`/admin/others`, buyer or seller or admin listing, and similar)
    - Payments (`/payments`, `/payments/history`, and related endpoints)
    - Services, disputes, referrals, and promotions
    - Platform settings, subscription plans, and other administration tasks

- Cloudinary or similar storage:
  - The `download-document` API route validates URLs containing `cloudinary.com`.
  - Used for secure file downloads such as dispute evidence or user documents.

### 7.3 UI and UX Libraries

- Radix UI – dropdowns, selects, tabs, and other primitives
- Tailwind CSS 4 – global styling
- Framer Motion – animations in modals and transitions
- React Icons and Lucide React – icons in the UI
- React Hot Toast – in-app toasts and notifications

### 7.4 Export and Reporting

- `file-saver`
- `jsPDF` and `jspdf-autotable`
- `xlsx`

These are used primarily in:

- Payment management for CSV and PDF exports
- Reports in user management, support, and promotions or referrals

## 8. User Roles, Permissions, and Admin Access Structure

### 8.1 Roles and Permissions Model

The backend issues JWTs containing:

- `roles: string[]`
- `permissions: { module: string; action: string }[]`

In `auth/[...nextauth]/route.ts`:

- The JWT callback merges `permissions` and `roles` into the token.
- The session callback exposes them under:
  - `session.user.permissions`
  - `session.user.roles`
  - `session.accessToken` and related fields

On the client:

- `src/store/Permissionsstore.ts` holds:
  - `permissions: Permission[]`
  - `roles: string[]`
- Helper methods:
  - `hasPermission(module, action)`
  - `canViewModule(module)`
  - `canManageModule(module)`
  - `canDeleteModule(module)`
  - `canExportModule(module)`
  - `getAccessibleModules()` and `getModuleActions(module)`

Example roles used in the UI (Invite and Permissions modals) include:

- Admin
- User Manager
- Content Manager
- Support Staff

The actual persisted roles are fetched from the backend via `admin.service.ts`.

### 8.2 Module-Level Access

Mappings between modules and routes are defined in:

- `src/data/layoutSidebarData.ts`
- `src/lib/routeProtection.ts` (the `MODULE_ROUTE_MAP` constant)

Modules:

- Dashboard – `/admin`
- User Management – `/admin/users-management`
- Payment Management – `/admin/payment-management`
- Dispute – `/admin/dispute-management`
- Service Management – `/admin/service-management`
- Promotional Offers – `/admin/promotional-offers` and subroutes for referrals
- Support and Feedback – `/admin/support`
- Settings – `/admin/settings` (explicitly allowed for any authenticated admin)

Route protection logic:

- Public routes:
  - `/auth/sign-in`
  - `/auth/forgot-password`
  - `/auth/sign-up` (if present in the backend)
  - `/api/auth/*`
- Any route under `/admin`:
  - Requires a valid session.
  - Requires `view` permission on the corresponding module, except settings.

### 8.3 Admin Lifecycle and Access Management

- Inviting new admins:
  - `src/app/admin/users-management/components/modals/InviteNewAdmin.tsx`
  - Uses `useAdminStore` and `adminService`:
    - Fetches available roles and permissions from the backend.
    - Allows assigning roles and selected permissions to new admin users.
    - Sends invites via `sendInvite`, after which the backend may trigger an email or create the user.

- Viewing admin details:
  - `AdminTable.tsx` and `AdminDetails.tsx` show admin-specific information, including assigned roles.

- Permissions configuration UI:
  - `PermissionsTable.tsx` provides a visual grid of actions versus roles to help reason about access levels. The actual persistence and enforcement is driven by backend rules.

## 9. Operational Playbook

### 9.1 Local Setup for Developers

1. Clone the repository:

```bash
git clone https://github.com/ReCreaX/one-universe-admin.git
cd one-universe-admin
```

2. Create a `.env.local` file:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-local-secret
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_PLATFORM_SETTINGS_ID=your-local-settings-id
```

3. Install packages:

```bash
npm install
```

4. Start the backend API locally (see the backend repository).

5. Run the app:

```bash
npm run dev
```

### 9.2 Day-to-Day Operations

- Monitoring:
  - Monitor the frontend hosting platform for build failures and runtime errors.
  - Monitor the backend API for responsiveness and error rates.
  - Many error paths log to `console.error`. Ensure your hosting platform captures these logs.

- Secrets and configuration:
  - Rotate `NEXTAUTH_SECRET` according to your security policy.
  - Keep `NEXT_PUBLIC_API_URL` up to date if backend endpoints change.
  - Maintain `NEXT_PUBLIC_PLATFORM_SETTINGS_ID` to point to the correct configuration record.

- Deployments:
  - Merging to `main` should trigger a deployment if CI or CD is configured.
  - Ensure the build command `npm run build` passes.
  - Run `npm run lint` in CI. Note that `next.config.ts` currently ignores ESLint errors during production builds.

- Common authentication issues:
  - If users are frequently logged out or get “Session expired” errors:
    - Check the `/auth/refresh-token` endpoint on the backend.
    - Verify that `NEXTAUTH_SECRET` is consistent across environments.
    - Confirm token expiry times and session `maxAge` align with business expectations.

## 10. Outstanding Issues and Technical Debt

The following items should be considered during ongoing maintenance:

1. ESLint configuration for builds:
   - `next.config.ts` sets `ignoreDuringBuilds: true` for ESLint.
   - This allows builds to succeed even with lint errors, which can hide issues.
   - Action: tighten the lint policy and enforce ESLint in CI.

2. Image domain configuration:
   - `next.config.ts` includes a placeholder host:
     - `hostname: "your-upload-domain.com"` with a note to replace it.
   - Action: replace this with the actual domain or domains that serve user-uploaded images or remove it if not needed.

3. Environment-specific base URLs:
   - Many services use `getBaseUrl("live")`, which hardcodes the live API.
   - Only some services rely on `NEXT_PUBLIC_API_URL`.
   - Action: consider centralizing environment selection through environment variables such as `NEXT_PUBLIC_API_URL` for better staging and UAT support.

4. Verbose logging in the authentication flow:
   - NextAuth callbacks contain console logs (for example, session building logs).
   - Action: review and reduce logging in production or route logs through a structured logging system.

5. Platform settings ID coupling:
   - `NEXT_PUBLIC_PLATFORM_SETTINGS_ID` is required for platform settings and referral program screens.
   - If missing, users see a configuration error toast.
   - Action: ensure this ID exists and is configured in all environments. Consider making it backend-resolved rather than front-end configured.

6. Backend-specific behaviours:
   - Some error messages and flows depend on exact backend response shapes (such as NestJS-style `{ statusCode, message }`).
   - Action: if backend contracts change, update error handling helpers such as `extractErrorMessage` in `authService.ts`.

If additional known bugs, performance issues, or UX gaps exist in your QA or issue tracker, append them to this section so operations and future maintainers have a single source of truth.
