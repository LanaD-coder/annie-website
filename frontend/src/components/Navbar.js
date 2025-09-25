import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaPhoneVolume, FaCut } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";

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
        <div className="logo">
          <img
            src={`${process.env.PUBLIC_URL}/assets/images/logo-annie.png`}
            alt="Logo"
          />
        </div>

        <nav>
          <ul>
            <li>
              <Link to="/">
                <FaHome size={20} />
              </Link>
            </li>
            <li>
              <Link to="/services">
                <FaCut size={20} />
              </Link>
            </li>
            <li>
              <Link to="/">
                <FaPhoneVolume size={20} />
              </Link>{" "}
            </li>

            {isAdmin ? (
              <li>
                <Link to="/admin">
                  <RiAdminFill size={20} />
                </Link>
              </li>
            ) : (
              <li>
                <Link to="/admin/login">
                  <RiAdminFill size={20} />
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
