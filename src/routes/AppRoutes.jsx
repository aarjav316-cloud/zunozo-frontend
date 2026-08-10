import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import NotFound from "../pages/NotFound";
import SignUpPage from "../pages/auth/SignUpPage";
import VerifyOtpPage from "../pages/auth/VerifyOtpPage";
import SignInPage from "../pages/auth/SignInPage";
import ForgotPasswordPage from "../pages/auth/ForgotPassword";
import ForgotPasswordFlow from "../pages/auth/ForgotPasswordFlow";
import ResetPasswordPage from "../pages/auth/ResetPassword";
import BrowseEvents from "../pages/public/BrowseEvents";
import EventDetails from "../pages/public/EventDetails";
import MyEvents from "../pages/organizer/MyEvents";
import CreateEvent from "../pages/organizer/CreateEvent";
import EditEvent from "../pages/organizer/EditEvent";
import BecomeOrganizer from "../pages/organizer/BecomeOrganizer";
import OrganizerProfile from "../pages/organizer/OrganizerProfile";
import EditOrganizerProfile from "../pages/organizer/EditOrganizerProfile";
import OrganizerDashboard from "../pages/organizer/Dashboard";
import EventBookings from "../pages/organizer/EventBookings";
import ScanTickets from "../pages/organizer/ScanTickets";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Organizers from "../pages/admin/Organizers";
import OrganizerDetails from "../pages/admin/OrganizerDetails";
import Profile from "../pages/user/Profile";
import EditProfile from "../pages/user/EditProfile";
import Security from "../pages/user/Security";
import MyBookings from "../pages/user/MyBookings";
import BookingDetails from "../pages/user/BookingDetails";
import ProtectedRoute from "../components/auth/ProtectedRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<BrowseEvents />} />
        <Route path="/events/:slug" element={<EventDetails />} />
        <Route path="/become-organizer" element={<BecomeOrganizer />} />
        <Route
          path="/organizer/dashboard"
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <OrganizerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/events"
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <MyEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/events/:eventId/bookings"
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <EventBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/scan-tickets"
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <ScanTickets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/events/:id/preview"
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <EventDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/events/:id/edit"
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <EditEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/events/create"
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/organizer"
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <OrganizerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/organizer/edit"
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <EditOrganizerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/organizers"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Organizers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/organizers/:organizerId"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <OrganizerDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/security"
          element={
            <ProtectedRoute>
              <Security />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings/:bookingId"
          element={
            <ProtectedRoute>
              <BookingDetails />
            </ProtectedRoute>
          }
        />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordFlow />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
