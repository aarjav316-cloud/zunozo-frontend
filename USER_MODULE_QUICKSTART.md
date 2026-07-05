# User Module - Quick Start Guide

## What Was Built

A complete, production-ready User Module with:

- ✅ User Profile page
- ✅ Edit Profile functionality
- ✅ Security settings (change password)
- ✅ Complete forgot password flow (4 steps)
- ✅ Logout functionality
- ✅ Route protection with role-based access
- ✅ Loading states and error handling
- ✅ Responsive design
- ✅ Toast notifications

## Files Created

### Frontend

```
frontend/src/
├── api/userApi.js                     # User API functions
├── components/
│   └── auth/ProtectedRoute.jsx        # Route protection
├── pages/
│   ├── auth/ForgotPasswordFlow.jsx    # Forgot password (4 steps)
│   └── user/
│       ├── Profile.jsx                # Main profile page
│       ├── EditProfile.jsx            # Edit profile
│       └── Security.jsx               # Change password
└── context/AuthContext.jsx            # Enhanced with timestamps
```

### Backend (Modified)

```
backend/src/
├── controllers/auth.controller.js     # Added updateProfile + enhanced getMe
└── routes/auth.routes.js              # Added PATCH /auth/profile
```

## New Routes

### Public Routes

- `/forgot-password` - Complete password recovery flow

### Protected Routes (All Authenticated Users)

- `/profile` - View profile
- `/profile/edit` - Edit profile
- `/profile/security` - Change password

### Role-Protected Routes

- `/organizer/*` - Only organizers
- `/admin/*` - Only admins

## How to Use

### 1. Access User Profile

Navigate to `/profile` or add a profile link in your navbar:

```jsx
<button onClick={() => navigate("/profile")}>Profile</button>
```

### 2. Edit Profile

From profile page, click "Edit Profile" or navigate to `/profile/edit`

### 3. Change Password

From profile page, click "Security Settings" or navigate to `/profile/security`

### 4. Logout

From profile page, click "Logout" button

### 5. Forgot Password

From signin page, click "Forgot Password" or navigate to `/forgot-password`

## Testing the Module

### Test Profile

1. Sign in as any user
2. Navigate to `/profile`
3. Verify all information displays correctly
4. Check responsive design on mobile

### Test Edit Profile

1. Go to `/profile/edit`
2. Change your name
3. Click "Save Changes"
4. Verify toast notification appears
5. Check profile page shows updated name

### Test Change Password

1. Go to `/profile/security`
2. Enter current password
3. Enter new password (test strength indicator)
4. Confirm new password
5. Click "Change Password"
6. Verify you're logged out
7. Sign in with new password

### Test Forgot Password

1. Go to `/forgot-password`
2. Enter your email
3. Check email for OTP
4. Enter OTP (60-second countdown should work)
5. Enter new password
6. Verify success screen
7. Go to signin
8. Login with new password

### Test Route Protection

1. Logout
2. Try to access `/profile` → Should redirect to signin
3. Login as regular user
4. Try to access `/admin/dashboard` → Should redirect to homepage
5. Try to access `/organizer/events` → Should redirect to homepage

## Integration Points

### Add Profile Link to Navbar

```jsx
import { useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <nav>
      {/* Other nav items */}

      {isAuthenticated ? (
        <button onClick={() => navigate("/profile")}>
          {user?.name || "Profile"}
        </button>
      ) : (
        <>
          <button onClick={() => navigate("/signin")}>Sign In</button>
          <button onClick={() => navigate("/signup")}>Sign Up</button>
        </>
      )}
    </nav>
  );
}
```

### Add Forgot Password Link to Signin

```jsx
<button
  onClick={() => navigate("/forgot-password")}
  className="text-sm text-zinc-400 hover:text-white"
>
  Forgot Password?
</button>
```

### Use Protected Routes

```jsx
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Protect any route
<Route
  path="/some-protected-route"
  element={
    <ProtectedRoute>
      <YourComponent />
    </ProtectedRoute>
  }
/>

// Protect with role requirement
<Route
  path="/organizer-only"
  element={
    <ProtectedRoute allowedRoles={["organizer"]}>
      <OrganizerComponent />
    </ProtectedRoute>
  }
/>
```

## API Endpoints Reference

### Frontend → Backend

#### Update Profile

```javascript
import { updateProfile } from "./api/userApi";

await updateProfile({ name: "New Name" });
```

#### Change Password

```javascript
import { changePassword } from "./api/userApi";

await changePassword({
  oldPassword: "current123",
  newPassword: "new123456",
});
```

#### Get Current User

```javascript
import { getCurrentUser } from "./api/authApi";

const response = await getCurrentUser();
// response.user contains: id, name, email, role, avatar, createdAt
```

#### Logout

```javascript
import { logoutUser } from "./api/authApi";

await logoutUser();
```

#### Forgot Password

```javascript
import { forgotPassword } from "./api/authApi";

await forgotPassword({ email: "user@example.com" });
```

#### Reset Password

```javascript
import { resetPassword } from "./api/authApi";

await resetPassword({
  email: "user@example.com",
  otp: "123456",
  newPassword: "newpassword123",
});
```

## Backend Endpoints

```
GET    /auth/me                      # Get current user
PATCH  /auth/profile                 # Update profile
POST   /auth/change-password         # Change password
POST   /auth/logout                  # Logout
POST   /auth/forgot-password         # Send OTP
POST   /auth/reset-password          # Reset with OTP
```

## Common Issues & Solutions

### Issue: User profile not showing timestamps

**Solution**: Backend now includes `createdAt` in `/auth/me` response

### Issue: Route protection not working

**Solution**: Ensure `AuthProvider` wraps your app in `App.jsx`

### Issue: User redirected after editing profile

**Solution**: This is expected. User stays on edit page until save is complete, then redirects to profile.

### Issue: Can't change password

**Solution**: Ensure old password is correct. After password change, user is logged out intentionally.

### Issue: OTP not received

**Solution**:

1. Check backend email configuration
2. Check spam folder
3. Verify email service is running

### Issue: Countdown timer not working

**Solution**: This is a React state issue. Component should remount properly. Check browser console for errors.

## Next Steps

### Immediate

1. Test all flows with different user roles
2. Add profile link to your navbar
3. Add forgot password link to signin page
4. Test on mobile devices

### Future Enhancements

1. Add profile image upload with Cloudinary
2. Add phone number field
3. Add email change with verification
4. Add two-factor authentication
5. Add activity log/login history
6. Add account deletion flow

## Support

For issues or questions about the User Module:

1. Check `USER_MODULE.md` for detailed documentation
2. Review the code comments in each component
3. Test with backend running on `http://localhost:5000`
4. Ensure frontend runs on `http://localhost:5173`

## Summary

The User Module is **production-ready** with:

- ✅ Complete functionality
- ✅ Error handling
- ✅ Loading states
- ✅ Validation
- ✅ Security features
- ✅ Responsive design
- ✅ Toast notifications
- ✅ Route protection
- ✅ Clean code
- ✅ Documentation

All features work with your existing backend APIs without breaking any existing functionality.
