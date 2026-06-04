# Support Ticket System

A full-featured internal support ticket management web application built with Next.js, TypeScript, and modern web technologies.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Date Formatting**: date-fns

## Features

- **Authentication System**: Login page with protected routes
- **Ticket Management**: Create, view, and filter support tickets
- **Ticket Status**: Update ticket status (Open, In Progress, Done)
- **Comments System**: Add comments to tickets for discussion
- **Search & Filter**: Search tickets by title/description and filter by status
- **Responsive Design**: Mobile-friendly UI with shadcn/ui components
- **Loading States**: Proper loading indicators throughout the app
- **Error Handling**: Comprehensive error handling and user feedback

## Project Structure

```
frontend-intern-ticket/
├── app/                      # Next.js App Router pages
│   ├── dashboard/            # Protected dashboard routes
│   │   ├── tickets/         # Ticket management pages
│   │   │   ├── [id]/        # Ticket detail page
│   │   │   └── new/         # Create new ticket page
│   │   └── layout.tsx       # Dashboard layout with navigation
│   ├── login/               # Authentication page
│   ├── layout.tsx           # Root layout with providers
│   └── page.tsx             # Home page (redirects based on auth)
├── components/              # Reusable components
│   ├── ui/                  # shadcn/ui components
│   ├── navigation.tsx       # Navigation header
│   ├── protected-route.tsx  # Route protection wrapper
│   └── providers/           # React context providers
├── contexts/                # React contexts
│   └── auth-context.tsx     # Authentication context
├── lib/                     # Utility libraries
│   ├── api/                 # API layer with Axios
│   │   ├── axios.ts         # Axios instance configuration
│   │   ├── auth.ts          # Authentication API calls
│   │   ├── tickets.ts       # Tickets API calls
│   │   └── index.ts         # API exports
│   ├── queries/             # TanStack Query hooks
│   │   ├── auth.ts          # Auth queries & mutations
│   │   ├── tickets.ts      # Ticket queries & mutations
│   │   └── index.ts         # Query exports
│   └── utils.ts             # Utility functions
└── types/                   # TypeScript type definitions
    └── index.ts             # Shared types
```

## Architecture

### API Layer (`lib/api/`)
- Centralized Axios instance with interceptors for auth tokens
- Type-safe API functions for tickets and authentication
- Consistent error handling across all API calls

### Query Layer (`lib/queries/`)
- TanStack Query hooks for data fetching and mutations
- Automatic caching and invalidation strategies
- Optimistic updates for better UX

### Authentication Flow
1. User enters credentials on login page
2. Auth context manages authentication state
3. Token stored in localStorage
4. Protected routes redirect unauthenticated users to login
5. Axios interceptor adds token to all requests

### State Management
- Server state: TanStack Query (caching, loading, errors)
- Client state: React Context (authentication)
- Form state: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# or
yarn install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials

For testing purposes, use these credentials:
- Email: `admin@example.com`
- Password: `password123`

## Building for Production

```bash
npm run build
npm start
```

## Key Implementation Details

### Type Safety
- Strict TypeScript configuration
- Shared types in `types/index.ts`
- Type-safe API responses and form data

### Form Validation
- React Hook Form for form state management
- Zod schemas for validation rules
- Real-time validation feedback

### Error Handling
- Try-catch blocks in all async operations
- User-friendly error messages
- Loading states for better UX

### Responsive Design
- Mobile-first approach with Tailwind CSS
- shadcn/ui components for consistent styling
- Dark mode support

## Future Enhancements

- Real-time updates with WebSockets
- File attachments for tickets
- User role-based permissions
- Email notifications
- Ticket assignment to team members
- Advanced filtering and sorting
- Export tickets to CSV/PDF

## License

This project is for internal use only.
