import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard";
import Navbar from "./components/Navbar";
import BookingSection from "./components/BookingSection";
import ServicesSection from "./components/ServicesSection";
import ProfileSection from "./components/ProfileSection";
import ContactModal from "./components/ContactModal";
import FooterSection from "./components/FooterSection";

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Video background */}
        <video autoPlay loop muted className="background-video">
          <source src="/assets/videos/background-better.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Page content */}
        <div className="content">
          <Navbar />

          <Routes>
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
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>

        {/* Sticky Footer */}
        <FooterSection />
      </div>
    </Router>
  );
}

export default App;
