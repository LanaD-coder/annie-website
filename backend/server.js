// backend/server.js
require("dotenv").config(); // load environment variables
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Temporary in-memory store for bookings
let bookings = [];

// Configure email transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your Gmail
    pass: process.env.EMAIL_PASS, // app password
  },
});

// Routes
app.get("/", (req, res) => {
  res.send("Booking API is running!");
});

// Get all bookings
app.get("/bookings", (req, res) => {
  res.json(bookings);
});

// Create a new booking
app.post("/bookings", (req, res) => {
  const { name, email, date, time, service } = req.body;

  if (!name || !email || !date || !time || !service) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Check if the date is full (max 5 slots)
  const bookingsOnDate = bookings.filter((b) => b.date === date);
  if (bookingsOnDate.length >= 5) {
    return res.status(400).json({ error: "This date is fully booked" });
  }

  const newBooking = { id: Date.now(), name, email, date, time, service };
  bookings.push(newBooking);

  // Email to booker
  const bookerMailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Booking Confirmation",
    text: `Hi ${name},\n\nYour booking for ${service} on ${date} at ${time} has been confirmed.\n\nThank you!`,
  };

  // Email to admin
  const adminMailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL, // put your admin email in .env
    subject: "New Booking Received",
    text: `New booking received:\n\nName: ${name}\nEmail: ${email}\nService: ${service}\nDate: ${date}\nTime: ${time}`,
  };

  // Send emails
  transporter.sendMail(bookerMailOptions, (err, info) => {
    if (err) console.error("Error sending booker email:", err);
    else console.log("Booker email sent:", info.response);
  });

  transporter.sendMail(adminMailOptions, (err, info) => {
    if (err) console.error("Error sending admin email:", err);
    else console.log("Admin email sent:", info.response);
  });

  res.status(201).json(newBooking);
});

// Delete a booking
app.delete("/bookings/:id", (req, res) => {
  const { id } = req.params;
  bookings = bookings.filter((b) => b.id !== parseInt(id));
  res.json({ message: "Booking deleted" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
