import React from "react";
import { services } from "../data";

function ServicesSection() {
  return (
    <section id="services">
      <em className="services-title">
        Kom ons maak jou so mooi buite soos jy binne is...
      </em>

      <div className="services">
        {services.map((services, index) => (
          <div className="service-grid" key={index}>
            <img src={services.image} alt={services.name} />
            <h3>{services.name}</h3>
            <p>{services.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ServicesSection;
