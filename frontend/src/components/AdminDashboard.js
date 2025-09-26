import React, { useEffect, useState } from "react";

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const auth = localStorage.getItem("auth");

    fetch("/admin/bookings", {
      headers: {
        Authorization: "Basic " + auth,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or fetch error");
        return res.json();
      })
      .then((data) => setBookings(data))
      .catch((err) => console.error(err));
  }, []);

  const auth = localStorage.getItem("auth");
  const [user] = atob(auth).split(":");

  return (
    <div>
      <h1>Welcome {user}!</h1>
      <h2>Admin Dashboard</h2>
      <button
        onClick={() => {
          localStorage.removeItem("auth");
          window.location.href = "/";
        }}
      >
        Logout
      </button>
      <ul>
        {bookings.map((b) => (
          <li key={b.id}>
            {b.name} - {b.email} - {b.service} - {b.date} {b.time}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
