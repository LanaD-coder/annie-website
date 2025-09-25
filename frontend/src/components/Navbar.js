import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("/admin/status")
      .then((res) => res.json())
      .then((data) => setIsAdmin(data.isAdmin))
      .catch(() => setIsAdmin(false));
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo on the left */}
        <div className="logo">
          <img
            src={`${process.env.PUBLIC_URL}/assets/images/logo-annie.png`}
            alt="Logo"
          />
        </div>

        {/* Navigation links */}
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/services">Services</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>

            {/* Conditional admin link */}
            {isAdmin ? (
              <li>
                <Link to="/admin">Admin Dashboard</Link>
              </li>
            ) : (
              <li>
                <Link to="/admin/login">Admin Login</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
