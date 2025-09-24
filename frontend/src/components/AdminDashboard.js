import React, { useEffect, useState } from "react";

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch("/admin/bookings", {
      headers: {
        Authorization: "Basic " + btoa("admin:yourStrongPassword"),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or fetch error");
        return res.json();
      })
      .then((data) => setBookings(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
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
