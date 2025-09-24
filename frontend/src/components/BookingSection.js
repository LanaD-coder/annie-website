import React, { useState, useEffect } from "react";
import "./BookingSection.css";

function BookingSection() {
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
    service: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/bookings")
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if selected date already has 5 bookings
    const dateBookings = bookings.filter((b) => b.date === formData.date);
    if (dateBookings.length >= 5) {
      setMessage(
        `The selected date (${formData.date}) is full. Please choose another date.`
      );
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setBookings([...bookings, data]);
        setMessage("Booking successfully created!");
        setFormData({ name: "", email: "", date: "", time: "", service: "" });
      } else {
        setMessage(data.error || "Error creating booking");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error connecting to server");
    }
  };

  // Group bookings by date for calendar view
  const bookingsByDate = bookings.reduce((acc, b) => {
    acc[b.date] = acc[b.date] || [];
    acc[b.date].push(b);
    return acc;
  }, {});

  return (
    <section className="booking-section">
      <h2>Book an Appointment</h2>
      {message && <p className="booking-message">{message}</p>}

      <form className="booking-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        />
        <select
          name="service"
          value={formData.service}
          onChange={handleChange}
          required
        >
          <option value="">Select Service</option>
          <option value="Hairstyling & Braiding">Hairstyling & Braiding</option>
          <option value="Manicure & Pedicure">Manicure & Pedicure</option>
          <option value="Facials & Skincare">Facials & Skincare</option>
          <option value="Makeup Services">Makeup Services</option>
          <option value="Massage Therapy">Massage Therapy</option>
          <option value="Waxing & Hair Removal">Waxing & Hair Removal</option>
          <option value="Hair Coloring & Highlights">
            Hair Coloring & Highlights
          </option>
        </select>
        <button type="submit">Book Now</button>
      </form>

      <h3>Bookings Calendar</h3>

      {/* Explanation text */}
      <p className="calendar-info">
        Days marked in <span className="full-day">red</span> are fully booked
        and unavailable. Please select another date for your appointment.
      </p>

      {bookings.length === 0 ? (
        <p>No bookings yet</p>
      ) : (
        <div className="calendar-grid">
          {Object.keys(bookingsByDate)
            .sort()
            .map((date) => (
              <div className="calendar-day" key={date}>
                <h4>{date}</h4>
                {bookingsByDate[date].length >= 5 && (
                  <p className="full-day">This day is full</p>
                )}
                <ul>
                  {bookingsByDate[date].map((b) => (
                    <li key={b.id}>
                      {b.time} — {b.name} ({b.service})
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      )}
    </section>
  );
}

export default BookingSection;
