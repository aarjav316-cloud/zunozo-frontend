# Role-Based Homepage Implementation

## Overview

The homepage now dynamically renders different content based on the authenticated user's role, providing a tailored experience for each user type.

## Architecture

### AuthContext (`src/context/AuthContext.jsx`)

Central authentication state management using React Context API:

- Fetches current user on app load via `/auth/me` endpoint
- Provides user data, role, loading state, and authentication status
- Accessible throughout the app via `useAuth()` hook

### Homepage Router (`src/pages/HomePage.jsx`)

Main entry point that determines which homepage to render:

- Shows loading spinner while fetching user data
- Routes to appropriate home component based on user role
- No hardcoded roles - all data comes from backend

### Role-Specific Home Components

#### GuestHome (`src/components/home/GuestHome.jsx`)

For non-authenticated users:

- Full marketing homepage with hero section
- Browse Events CTA
- Become Organizer CTA
- Trending events
- Why Zunozo section
- Login/Signup in navbar

#### UserHome (`src/components/home/UserHome.jsx`)

For authenticated users with "user" role:

- Same marketing content as GuestHome
- Profile avatar replaces Login/Signup buttons
- Can still browse events and become organizer

#### OrganizerHome (`src/components/home/OrganizerHome.jsx`)

For authenticated users with "organizer" role:

- Welcome message with user's first name
- Quick action buttons:
  - Create Event
  - My Events
  - Browse Events
- Statistics dashboard:
  - Total Events
  - Approved Events
  - Pending Review
  - Rejected Events
- Recent events (last 3) with preview
- No marketing content

#### AdminHome (`src/components/home/AdminHome.jsx`)

For authenticated users with "admin" role:

- Welcome message for admin
- Quick action buttons:
  - Review Pending Events
  - View All Events
  - Manage Users (placeholder)
- Statistics dashboard:
  - Pending Reviews
  - Approved Events
  - Rejected Events
  - Total Events
- Recent pending events preview
- Platform activity section (placeholder)
- No marketing content

## Navigation Per Role

### Guest

- Browse Events
- Become Organizer
- Login
- Signup

### User

- Browse Events
- Become Organizer
- Profile

### Organizer

- Dashboard (/)
- My Events
- Create Event
- Browse Events
- Profile

### Admin

- Dashboard (/)
- Pending Reviews
- All Events
- Users (placeholder)
- Profile

## API Integration

### Authentication

- `GET /auth/me` - Fetch current user (called on app load)
- Returns user object with `role` field

### Data Fetching

- **Organizer**: `GET /events/my-events` for dashboard statistics
- **Admin**: `GET /events/admin/pending` for dashboard statistics

## Key Features

### Automatic Role Detection

- No manual role assignment
- Backend determines user role
- Frontend adapts UI automatically

### Seamless Loading

- Loading spinner while fetching user data
- Prevents flash of wrong content
- Smooth transitions between states

### Modular Architecture

- Each role has dedicated component
- Easy to add new roles or modify existing
- Clean separation of concerns

### Preserved Functionality

- All existing authentication flows unchanged
- All backend APIs unchanged
- All routes preserved
- Existing components reused

## Future Enhancements

- Real-time statistics updates
- Analytics dashboard for admin
- User management interface
- Activity feeds
- Notification system

## No Backend Changes

This implementation uses existing backend APIs without any modifications to:

- Authentication endpoints
- User model
- Role assignment
- Event APIs
- Any other backend logic
