import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import navigate hook
import "../styles.css";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const superusers = [
    { username: "Anniepan", password: "salonlavidadmin@2025" },
    { username: "LanaD-coder", password: "DOLANA7381@" },
  ];

  useEffect(() => {
    document.body.style.backgroundImage = `url(${process.env.PUBLIC_URL}/assets/images/pexels-raymond-li-70587962-33328237.jpg)`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.minHeight = "100vh";

    return () => {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundPosition = "";
      document.body.style.backgroundRepeat = "";
      document.body.style.minHeight = "";
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    // check if user is in the superusers list
    const validUser = superusers.find(
      (u) => u.username === username && u.password === password
    );

    if (validUser) {
      // store credentials securely (base64 for Basic Auth)
      localStorage.setItem("auth", btoa(username + ":" + password));
      navigate("/dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="admin-login-container d-flex justify-content-center align-items-center">
      <div
        className="card shadow-lg p-4 login-card"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <div className="text-center mb-4">
          <h3 className="mt-3">Welkom Annie!</h3>
          <p className="text-muted">Log in om jou afsprake te sien:</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <br />

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
