import React from "react";

function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <p>
          &copy; {new Date().getFullYear()} Salon La Vida. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
