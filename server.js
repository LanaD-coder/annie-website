// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const path = require("path");
const session = require("express-session");

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------------
// Middleware
// ---------------------------
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// ---------------------------
// In-memory store for bookings
// ---------------------------
let bookings = [];

// ---------------------------
// Email setup
// ---------------------------
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// ---------------------------
// Public routes
// ---------------------------
app.get("/bookings", (req, res) => res.json([]));

app.post("/bookings", (req, res) => {
  const { name, email, date, time, service } = req.body;

  if (!name || !email || !date || !time || !service)
    return res.status(400).json({ error: "All fields are required" });

  // Max 5 bookings per day
  const bookingsOnDate = bookings.filter((b) => b.date === date);
  if (bookingsOnDate.length >= 5)
    return res.status(400).json({ error: "This date is fully booked" });

  // Prevent duplicate time slots
  if (bookingsOnDate.find((b) => b.time === time))
    return res.status(400).json({ error: "Time slot already booked" });

  const newBooking = { id: Date.now(), name, email, date, time, service };
  bookings.push(newBooking);

  // Send emails
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Booking Confirmation",
    text: `Hi ${name}, your booking for ${service} on ${date} at ${time} is confirmed.`,
  });

  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: ADMIN_EMAIL,
    subject: "New Booking Received",
    text: `New booking:\nName: ${name}\nEmail: ${email}\nService: ${service}\nDate: ${date}\nTime: ${time}`,
  });

  res.status(201).json(newBooking);
});

// ---------------------------
// Admin routes
// ---------------------------
function requireAdmin(req, res, next) {
  if (req.session?.isAdmin) return next();
  res.sendStatus(401);
}

app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    return res.json({ message: "Login successful" });
  }
  res.status(401).json({ error: "Invalid credentials" });
});

app.post("/admin/logout", (req, res) => {
  req.session.destroy(() => res.sendStatus(200));
});

app.get("/admin/status", (req, res) =>
  res.json({ isAdmin: !!req.session.isAdmin })
);
app.get("/admin/bookings", requireAdmin, (req, res) => res.json(bookings));
app.delete("/bookings/:id", requireAdmin, (req, res) => {
  bookings = bookings.filter((b) => b.id !== parseInt(req.params.id));
  res.json({ message: "Booking deleted" });
});

// ---------------------------
// Serve React frontend
// ---------------------------
app.use(express.static(path.join(__dirname, "frontend", "build")));
app.get("/*", (req, res) =>
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"))
);

// ---------------------------
// Start server
// ---------------------------
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
