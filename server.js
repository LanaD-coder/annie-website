// server.js
require("dotenv").config(); // load environment variables
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const path = require("path");
const session = require("express-session");

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true, // allow cookies
  })
);
app.use(express.json());

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" }, // secure cookies in production
  })
);

// Temporary in-memory store for bookings
let bookings = [];

// Configure email transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Public route for normal users
app.get("/bookings", (req, res) => {
  res.json([]); // normal users cannot see bookings
});

// Add a new booking
app.post("/bookings", (req, res) => {
  const { name, email, date, time, service } = req.body;

  if (!name || !email || !date || !time || !service) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Prevent double bookings at the same time slot
  const isSlotTaken = bookings.some((b) => b.date === date && b.time === time);
  if (isSlotTaken) {
    return res.status(400).json({ error: "This time slot is already booked" });
  }

  // Max 5 bookings per date
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
    to: process.env.ADMIN_EMAIL,
    subject: "New Booking Received",
    text: `New booking received:\n\nName: ${name}\nEmail: ${email}\nService: ${service}\nDate: ${date}\nTime: ${time}`,
  };

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

// Delete a booking (admin only)
app.delete("/bookings/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  bookings = bookings.filter((b) => b.id !== parseInt(id));
  res.json({ message: "Booking deleted" });
});

// Admin login
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    return res.status(200).json({ message: "Login successful" });
  }

  res.status(401).json({ error: "Invalid credentials" });
});

// Admin logout
app.post("/admin/logout", (req, res) => {
  req.session.destroy();
  res.sendStatus(200);
});

// Check admin status
app.get("/admin/status", (req, res) => {
  res.json({ isAdmin: !!req.session.isAdmin });
});

// Middleware to protect admin routes
function requireAdmin(req, res, next) {
  if (req.session?.isAdmin) return next();
  res.sendStatus(401);
}

// Protected admin bookings route
app.get("/admin/bookings", requireAdmin, (req, res) => {
  res.json(bookings);
});

// Serve React frontend
app.use(express.static(path.join(__dirname, "frontend", "build")));
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
