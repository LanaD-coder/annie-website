import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./components/AdminLogin";
import Navbar from "./components/Navbar";
import BookingSection from "./components/BookingSection";
import ServicesSection from "./components/ServicesSection";
import ProfileSection from "./components/ProfileSection";
import ContactModal from "./components/ContactModal";
import FooterSection from "./components/FooterSection";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const location = useLocation();

  return (
    <div className="app-container">
      {/* Only show background video if NOT on admin login */}
      {location.pathname !== "/admin/login" && (
        <video autoPlay loop muted className="background-video">
          <source src="/assets/videos/background-better.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Page content */}
      <div className="content">
        <Navbar />

        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              <>
                <ProfileSection />
                <ServicesSection />
                <BookingSection />
                <ContactModal />
              </>
            }
          />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected admin route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      {/* Sticky Footer */}
      <FooterSection />
    </div>
  );
}

export default App;
