import React from "react";

function ProfileSection() {
  return (
    <section className="profile-section">
      <div className="profile-image">
        <img src="/assets/images/annie-profile-pic.png" alt="Salon La Vida" />
      </div>

      <div className="profile-text">
        <h1>
          <em>Salon La Vida</em>
        </h1>
        <p>User profile details will appear here.</p>
      </div>
    </section>
  );
}

export default ProfileSection;
