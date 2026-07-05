import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import NotFound from "../pages/NotFound";
import SignUpPage from "../pages/auth/SignUpPage";
import VerifyOtpPage from "../pages/auth/VerifyOtpPage";
import SignInPage from "../pages/auth/SignInPage";
import ForgotPasswordPage from "../pages/auth/ForgotPassword";
import ResetPasswordPage from "../pages/auth/ResetPassword";
import BrowseEvents from "../pages/public/BrowseEvents";
import EventDetails from "../pages/public/EventDetails";
import MyEvents from "../pages/organizer/MyEvents";
import CreateEvent from "../pages/organizer/CreateEvent";
import EditEvent from "../pages/organizer/EditEvent";
import AdminDashboard from "../pages/admin/AdminDashboard";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<BrowseEvents />} />
        <Route path="/events/:slug" element={<EventDetails />} />
        <Route path="/organizer/events" element={<MyEvents />} />
        <Route
          path="/organizer/events/:id/preview"
          element={<EventDetails />}
        />
        <Route path="/organizer/events/:id/edit" element={<EditEvent />} />
        <Route path="/organizer/events/create" element={<CreateEvent />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
