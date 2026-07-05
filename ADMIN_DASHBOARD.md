# Admin Dashboard Documentation

## Overview

Premium admin dashboard for reviewing and moderating event submissions on Zunoozo.

## Access

Navigate to `/admin/dashboard` when logged in as an admin user.

## Features

### Statistics Cards

- **Pending Review**: Events awaiting moderation
- **Approved**: Successfully approved events
- **Rejected**: Rejected events
- **Changes Requested**: Events requiring modifications
- **Total Events**: All events in the system

### Event List

- View all pending events with cover images
- See organizer information
- Filter by status (All, Pending, Approved, Rejected, Changes Requested)
- Search by title, category, or organizer name
- Quick actions: View Details, Approve, Reject

### Event Details Drawer

Opens a side drawer showing complete event information:

- Cover image and gallery
- Full description
- Organizer details
- Venue information
- Date, time, capacity
- Pricing
- Tags
- Previous review comments

### Moderation Actions

- **Approve**: Publish the event immediately
- **Reject**: Reject with required comment
- **Request Changes**: Ask organizer to modify with required feedback

### Real-time Updates

- Events removed from list immediately after moderation
- Statistics refresh automatically
- Toast notifications for success/error states
- Loading states during API calls

### Error Handling

- Network failure recovery
- User-friendly error messages
- Retry functionality

## API Integration

### Endpoints Used

- `GET /events/admin/pending` - Fetch pending events
- `PATCH /events/admin/:eventId/review` - Review event

### Authentication

Requires admin role authorization (handled by existing middleware).

## Components

### Admin Components

- `StatCard.jsx` - Statistics display card
- `PendingEventCard.jsx` - Event card with quick actions
- `EventDetailsDrawer.jsx` - Side drawer for event details
- `ReviewModal.jsx` - Confirmation modal for moderation
- `EmptyState.jsx` - Empty state when no events
- `SkeletonCard.jsx` - Loading skeleton

### UI Theme

- Dark theme matching Zunoozo design
- Geist font with tight tracking
- Rounded corners and subtle borders
- Smooth animations and transitions
- Responsive layout

## No Backend Changes

This dashboard uses existing backend APIs without any modifications to:

- Routes
- Controllers
- Middleware
- Validation
- Database schema
- API responses
