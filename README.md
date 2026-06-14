# Internal Ticket Management System

## Project Introduction
This is my submission for the Frontend Intern Assignment #1. It is a full-featured internal support ticket application built from scratch over 5 working days. The goal of this project was to implement a clean, type-safe React application using the modern Next.js App Router and TanStack Query for server state management.

## Tech Stack
As per the assignment requirements, the following tools were used:
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (Strict typing)
- **Styling:** Tailwind CSS & shadcn/ui
- **State Management:** TanStack Query v5 (Caching, loading/error states)
- **Form Handling:** React Hook Form & Zod (Schema-based validation)
- **HTTP Client:** Axios (Wrapped in a custom instance)

## Installation Prerequisites
- **Node.js:** 18.x or later
- **Package Manager:** npm

## Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd frontend-intern-ticket
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **View the app:**
   Open http://localhost:3000 in your browser.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Architecture Notes

### 1. Folder Structure
I organized the project to keep logic separated from the UI:
- `/app`: Handles routing and page layouts.
- `/components`: Reusable UI components (shadcn/ui and custom cards/skeletons).
- `/hooks`: Custom hooks for data fetching to keep the page components thin.
- `/lib`: API configurations and the Mock API implementation.
- `/types`: Centralized TypeScript interfaces for Tickets and Comments.

### 2. Authentication & Protected Routes
I implemented route protection using **Next.js Middleware**. The middleware checks for an `auth-token` cookie before rendering any protected routes (`/tickets/*`). If the token is missing, the user is redirected to `/login`.

### 3. Server State Management
**TanStack Query** is used for all data fetching. This allows for:
- Automatic caching and background refetching.
- Simplified handling of loading skeletons and error states.
- Efficient cache invalidation (e.g., refetching the ticket list automatically after a new ticket is created).

## Mock API (Option A)
Since there is no real backend, I implemented **Option A** using a `lib/mock-api.ts` file.
- It uses an in-memory array to store data during the session.
- All functions return Promises with a `setTimeout` (400ms - 800ms) to simulate realistic network latency.
- This allowed me to properly implement and test loading skeletons and "Retry" logic for failed requests.

## Known Limitations & Improvements

### Current Limitations
- **Data Persistence:** Because I used the in-memory array approach (Option A), all newly created tickets or comments will be lost if the server process restarts (e.g., during code changes or a hard server refresh).
- **Mock Auth:** Any valid email and a 6-character password will work for login.

### Future Improvements
- **Optimistic Updates:** I would like to add optimistic updates for status changes so the UI reflects the change immediately before the API responds.
- **Global Error Boundary:** Adding a root-level error boundary to catch unexpected crashes more gracefully.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
