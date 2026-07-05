# User Module Documentation

## Overview

Complete user management system with profile management, security settings, and password recovery functionality using existing backend APIs.

## Features Implemented

### 1. User Profile (`/profile`)

**Component**: `frontend/src/pages/user/Profile.jsx`

Features:

- Display user information (name, email, role, member since)
- Profile avatar with initials fallback
- Role-based badge display
- Quick action cards for security settings and logout
- Account details section
- Responsive layout

Actions:

- Edit Profile button → navigates to `/profile/edit`
- Security Settings button → navigates to `/profile/security`
- Logout button → logs out user and redirects to homepage

### 2. Edit Profile (`/profile/edit`)

**Component**: `frontend/src/pages/user/EditProfile.jsx`

Features:

- Pre-filled form with current user data
- Name field editing (email is read-only)
- Profile image placeholder (ready for future Cloudinary integration)
- Inline validation
- Loading states
- Success/error toast notifications
- Auto-refresh profile data after update

Backend API: `PATCH /auth/profile`

### 3. Security Settings (`/profile/security`)

**Component**: `frontend/src/pages/user/Security.jsx`

Features:

- Change password form with 3 fields:
  - Current password
  - New password
  - Confirm password
- Toggle password visibility for all fields
- Real-time password strength indicator with color coding:
  - Weak (red)
  - Fair (amber)
  - Good (blue)
  - Strong (emerald)
- Password match validation
- Prevents same password as current
- Auto-logout after password change
- Redirect to signin page

Backend API: `POST /auth/change-password`

Password Strength Criteria:

- Length ≥ 8 characters
- Length ≥ 12 characters
- Mixed case (uppercase + lowercase)
- Contains numbers
- Contains special characters

### 4. Forgot Password Flow (`/forgot-password`)

**Component**: `frontend/src/pages/auth/ForgotPasswordFlow.jsx`

Multi-step flow:

**Step 1: Email Input**

- Enter email address
- Send OTP button
- Back to signin link

**Step 2: OTP Verification**

- 6-digit OTP input with centered display
- 60-second countdown timer
- Resend OTP button (disabled during countdown)
- Auto-disable resend until timer expires

**Step 3: New Password**

- New password input
- Confirm password input
- Password match validation

**Step 4: Success Screen**

- Success message with icon
- Redirect to signin button

Backend APIs:

- `POST /auth/forgot-password` - Send OTP
- `POST /auth/reset-password` - Reset password with OTP

### 5. Logout

**Implementation**: Integrated in Profile component

Features:

- Logout button with loading state
- Calls `POST /auth/logout` endpoint
- Clears authentication state
- Shows success toast
- Redirects to homepage after 1 second

### 6. Route Protection

**Component**: `frontend/src/components/auth/ProtectedRoute.jsx`

Features:

- Loading state while checking authentication
- Redirects unauthenticated users to `/signin`
- Role-based access control
- Flexible configuration per route

Usage Examples:

```jsx
// Require any authenticated user
<ProtectedRoute>
  <Profile />
</ProtectedRoute>

// Require specific role
<ProtectedRoute allowedRoles={["admin"]}>
  <AdminDashboard />
</ProtectedRoute>

// Require one of multiple roles
<ProtectedRoute allowedRoles={["organizer", "admin"]}>
  <MyEvents />
</ProtectedRoute>
```

Protected Routes:

- `/profile` - All authenticated users
- `/profile/edit` - All authenticated users
- `/profile/security` - All authenticated users
- `/organizer/*` - Only organizers
- `/admin/*` - Only admins

## Backend Changes

### New Endpoints Added

#### Update Profile

```
PATCH /auth/profile
Protected: Yes (requires authentication)

Request Body:
{
  "name": "string" (required, min 2 characters)
}

Response:
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

### Enhanced Endpoints

#### Get Current User

```
GET /auth/me
Protected: Yes

Response (Enhanced):
{
  "success": true,
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "avatar": "string | null",
    "createdAt": "ISO date string"
  }
}
```

## API Integration

### User API (`frontend/src/api/userApi.js`)

New API functions:

- `updateProfile(data)` - Update user profile
- `changePassword(data)` - Change user password

### Auth API (existing)

Used endpoints:

- `getCurrentUser()` - Fetch current user data
- `logoutUser()` - Logout user
- `forgotPassword(data)` - Send OTP to email
- `resetPassword(data)` - Reset password with OTP

## UI/UX Features

### Design System

- Dark theme (#09090B background, #18181B cards)
- Geist font with tight letter-spacing
- Rounded corners (xl = 12px, 2xl = 16px)
- Subtle borders (zinc-800)
- Smooth transitions (200-300ms)

### Color Coding

- Success: Emerald (green)
- Error: Rose (red)
- Warning: Amber (yellow)
- Info: Blue
- Admin: Purple
- Organizer: Blue
- User: Zinc (gray)

### Loading States

- Skeleton loaders for profile data
- Spinner for buttons during API calls
- Disabled states during loading
- Loading text feedback ("Saving...", "Updating...")

### Error Handling

- Inline field validation errors
- Toast notifications for API errors
- User-friendly error messages
- Network failure handling
- Backend validation error display

### Responsive Design

**Desktop (≥768px)**

- Two-column layouts
- Sidebar navigation
- Larger text and spacing

**Tablet (640px-768px)**

- Stacked layouts
- Adjusted spacing
- Readable font sizes

**Mobile (<640px)**

- Single column
- Touch-friendly buttons
- Compact spacing
- Full-width forms

## Security Features

1. **Protected Routes**: Unauthorized users redirected to signin
2. **Role-Based Access**: Users can't access admin/organizer pages
3. **Password Requirements**: Minimum 6 characters enforced
4. **Password Visibility Toggle**: User control over password visibility
5. **Auto-Logout on Password Change**: Forces re-authentication
6. **OTP Expiration**: 5-minute OTP validity (backend)
7. **Rate Limiting**: Backend rate limits on auth endpoints

## User Experience Flow

### New User Journey

1. Signup → Verify OTP → Auto-login → Homepage (role-based)
2. Click Profile → View profile → Edit details → Save
3. Navigate to Security → Change password → Logout → Signin

### Forgot Password Journey

1. Signin page → Forgot password link
2. Enter email → Receive OTP
3. Enter OTP → Verify
4. Set new password → Success screen
5. Go to signin → Login with new password

### Profile Management Journey

1. Any page → Profile link/button
2. View profile information
3. Edit profile → Update name
4. Security settings → Change password
5. Logout

## Future Enhancements

### Ready for Implementation

1. **Profile Image Upload**
   - Placeholder UI already in place
   - Ready for Cloudinary integration
   - Avatar field exists in User model

2. **Phone Number**
   - Add to User model
   - Add to edit profile form
   - Add validation

3. **Email Verification**
   - Verify email changes
   - Send verification email

4. **Two-Factor Authentication**
   - OTP-based 2FA
   - Backup codes

5. **Activity Log**
   - Login history
   - Profile changes
   - Security events

## Testing Checklist

### Profile

- [ ] View profile as user/organizer/admin
- [ ] All fields display correctly
- [ ] Member since date formats correctly
- [ ] Role badge shows correct color
- [ ] Avatar initials calculate correctly

### Edit Profile

- [ ] Form pre-fills with current data
- [ ] Name validation works
- [ ] Email field is disabled
- [ ] Save button shows loading state
- [ ] Success toast appears
- [ ] Profile data refreshes after save
- [ ] Back button navigates to profile

### Security

- [ ] All password fields toggle visibility
- [ ] Password strength indicator updates
- [ ] Confirm password validation works
- [ ] Same password validation works
- [ ] Loading state shows while changing
- [ ] User logged out after change
- [ ] Redirect to signin works

### Forgot Password

- [ ] Email validation works
- [ ] OTP sent toast appears
- [ ] OTP field accepts 6 digits
- [ ] Countdown timer works
- [ ] Resend button disabled during countdown
- [ ] Invalid OTP shows error
- [ ] Password fields validate
- [ ] Success screen displays
- [ ] Redirect to signin works

### Route Protection

- [ ] Guests redirected to signin
- [ ] Users can't access admin routes
- [ ] Users can't access organizer routes
- [ ] Organizers can't access admin routes
- [ ] Loading spinner shows while checking auth

## File Structure

```
frontend/src/
├── api/
│   └── userApi.js                    # User-specific API functions
├── components/
│   └── auth/
│       └── ProtectedRoute.jsx        # Route protection component
├── pages/
│   ├── auth/
│   │   └── ForgotPasswordFlow.jsx    # Complete forgot password flow
│   └── user/
│       ├── Profile.jsx               # User profile page
│       ├── EditProfile.jsx           # Edit profile page
│       └── Security.jsx              # Security settings page
└── routes/
    └── AppRoutes.jsx                 # Updated with protected routes

backend/src/
├── controllers/
│   └── auth.controller.js            # Added updateProfile function
└── routes/
    └── auth.routes.js                # Added PATCH /auth/profile
```

## Preserved Existing Architecture

✅ No changes to event module
✅ No changes to database schema (except adding updateProfile endpoint)
✅ No changes to authentication middleware
✅ No changes to existing validation
✅ Reused existing components (Toast, etc.)
✅ Maintained existing folder structure
✅ Followed existing coding patterns

## Production Ready

✅ Complete error handling
✅ Loading states everywhere
✅ Responsive design
✅ Form validation
✅ Security best practices
✅ User-friendly messages
✅ Toast notifications
✅ Route protection
✅ Role-based access
✅ Password strength indicator
✅ Auto-logout on password change
✅ Countdown timer for OTP
✅ Clean, modular code
