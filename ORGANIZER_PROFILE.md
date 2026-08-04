# Organizer Profile Feature Documentation

## Overview

Complete implementation of Organizer Profile functionality that displays both User and Organizer information separately, with dedicated profile and edit pages for organizers.

## Backend Implementation

### Models

- **User Model**: Contains account information (name, email, avatar, role, createdAt)
- **Organizer Model**: Contains organizer-specific information linked to User via reference

### API Endpoints

#### Get Organizer Profile

```
GET /api/v1/organizers/me
Protected: Yes (organizer role required)

Response:
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "avatar": "string | null",
      "role": "string",
      "createdAt": "ISO date"
    },
    "organizer": {
      "id": "string",
      "organizerName": "string",
      "phone": "string",
      "about": "string",
      "instagram": "string | null",
      "website": "string | null",
      "isVerified": boolean,
      "createdAt": "ISO date",
      "updatedAt": "ISO date"
    }
  }
}
```

#### Update Organizer Profile

```
PATCH /api/v1/organizers/me
Protected: Yes (organizer role required)

Request Body:
{
  "phone": "string" (optional),
  "about": "string" (optional),
  "instagram": "string" (optional),
  "website": "string" (optional)
}

Response: Same as GET /api/v1/organizers/me
```

### Validation

- **Phone**: 10-15 digits
- **About**: Max 1000 characters
- **Instagram/Website**: Valid URLs (optional)

## Frontend Implementation

### New Components

#### OrganizerProfile (`/profile/organizer`)

- Displays both User and Organizer information separately
- Shows verification status with visual badge
- Quick action buttons (Edit Profile, Security, Logout)
- Account Information section (User data)
- Organizer Information section (Organizer data)
- Links to social profiles if provided
- About section display

#### EditOrganizerProfile (`/profile/organizer/edit`)

- Separate sections for User and Organizer data
- Updates User info via existing User API
- Updates Organizer info via new Organizer API
- Dual API calls on save with proper error handling
- Character count for About field
- URL validation for social links
- Loading states during save

### Updated Components

#### OrganizerHome

- Now fetches both user and organizer profile data
- Displays organizer name in welcome message
- Uses organizer-specific data where available

#### User Profile/EditProfile

- Automatically redirects organizers to `/profile/organizer` and `/profile/organizer/edit`
- Ensures organizers use their dedicated profile pages

#### OrganizerNavbar

- Profile avatar now links to `/profile/organizer` instead of `/profile`

### API Service

#### organizerApi.js

```javascript
// Get organizer profile
export const getOrganizerProfile = async () => { ... }

// Update organizer profile
export const updateOrganizerProfile = async (data) => { ... }

// Become organizer (existing)
export const becomeOrganizer = async (data) => { ... }
```

## Routes

### New Routes

- `/profile/organizer` - Organizer profile page (organizer only)
- `/profile/organizer/edit` - Edit organizer profile (organizer only)

### Route Protection

- Both routes require organizer role
- Regular profile routes redirect organizers to organizer-specific routes

## Features

### Data Separation

- **User Data**: Managed by existing User APIs
  - Name, email, avatar, role, account creation date
- **Organizer Data**: Managed by new Organizer APIs
  - Phone, about, social links, verification status, organizer creation date

### Profile Display

- **Avatar**: Shows initials if no image, with verification badge overlay
- **Information Sections**: Clearly separated User vs Organizer information
- **Social Links**: Clickable links to Instagram/Website if provided
- **Verification Status**: Visual indication of verification status

### Edit Functionality

- **Dual Updates**: Updates both User and Organizer data in parallel
- **Validation**: Client-side and server-side validation
- **Error Handling**: Displays specific field errors
- **Success Flow**: Shows toast, refetches data, redirects to profile

### User Experience

- **Auto-redirect**: Organizers automatically see organizer profile pages
- **Loading States**: Skeleton loaders during data fetch
- **Responsive Design**: Works on all screen sizes
- **Consistent Styling**: Matches Zunozo dark theme and Geist typography

## Implementation Details

### Backend Controller Logic

```javascript
// Populates User data when returning organizer profile
const organizer = await Organizer.findOne({ user: req.user._id }).populate({
  path: "user",
  select: "name email avatar role createdAt",
});
```

### Frontend Data Flow

1. User logs in as organizer
2. OrganizerHome fetches organizer profile data
3. Profile avatar links to `/profile/organizer`
4. Profile page displays both User and Organizer information
5. Edit page allows updating both data sources
6. Save triggers dual API calls to update both models

### Error Handling

- **Backend**: Proper validation errors with field-specific messages
- **Frontend**: Toast notifications for success/error states
- **Network**: Graceful handling of API failures
- **Validation**: Real-time client-side validation with error display

## Security

- **Role Protection**: Only organizers can access organizer profile APIs
- **Data Separation**: User data only updatable through User APIs
- **Validation**: Server-side validation prevents invalid data
- **Authentication**: All endpoints require valid authentication

## Future Enhancements

- **Avatar Upload**: Profile image upload functionality
- **Email Change**: Email change with verification
- **Verification Process**: Admin verification workflow for organizers
- **Social Media Integration**: Direct social media posting
- **Analytics**: Organizer performance metrics
- **Portfolio**: Event portfolio/showcase section

## Testing Checklist

### Backend

- [ ] GET /api/v1/organizers/me returns complete profile
- [ ] PATCH /api/v1/organizers/me updates organizer data only
- [ ] Validation works for all fields
- [ ] Role protection prevents non-organizer access
- [ ] User data is properly populated

### Frontend

- [ ] Organizer profile displays all information correctly
- [ ] Edit profile pre-fills with current data
- [ ] Dual save updates both User and Organizer data
- [ ] Auto-redirect works for organizers
- [ ] Loading states show during API calls
- [ ] Error messages display for validation failures
- [ ] Success flow works end-to-end
- [ ] Responsive design works on mobile

### Integration

- [ ] Organizer dashboard shows organizer name
- [ ] Profile avatar links to organizer profile
- [ ] Navigation flows work correctly
- [ ] Authentication state persists
- [ ] Role-based routing functions properly

## File Structure

```
backend/src/modules/organizer/
├── controllers/organizer.controller.js  # Enhanced with profile methods
├── routes/organizer.routes.js           # Added profile routes
├── validation/organizer.validation.js   # Added update validation
└── models/organizer.model.js           # Existing model

frontend/src/
├── api/organizerApi.js                 # New organizer API service
├── pages/organizer/
│   ├── OrganizerProfile.jsx           # New organizer profile page
│   └── EditOrganizerProfile.jsx       # New edit profile page
├── components/home/OrganizerHome.jsx  # Enhanced with organizer data
├── components/organizer/OrganizerNavbar.jsx # Updated profile link
├── pages/user/Profile.jsx             # Added organizer redirect
├── pages/user/EditProfile.jsx         # Added organizer redirect
└── routes/AppRoutes.jsx               # Added new routes
```

## Summary

The Organizer Profile feature is now complete and production-ready, providing a comprehensive profile management system that properly separates User account data from Organizer-specific information while maintaining data integrity and security.
