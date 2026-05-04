import React, { useState } from "react";

import { Form, Button, Alert, InputGroup } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
function Login() {
  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await api.post("/login/", form);

    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);

    const user = await api.get("/profile/");


    localStorage.setItem("role", user.data.role);
    localStorage.setItem("department", user.data.department || "");

    const role = user.data.role?.toLowerCase();

    if (role === "admin") navigate("/admin");
    else if (role === "department") navigate("/department");
    else navigate("/dashboard");

  } catch (err) {
    setError(err.response?.data?.detail || "Invalid username or password");
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "#b8bec5",
        borderRadius: "15px",
      }}
    >
      {/* LEFT SIDE - BRAND PANEL */}

      <div
        style={{
          flex: 1,
          background: "linear-gradient(135deg, #0fcad7, #70059a)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          borderRadius: "15px",
          padding: "60px"
        }}
      >
        <h1 style={{ fontWeight: "800", marginBottom: "10px" }}>
          Smart Incident Platform
        </h1>

        <p style={{ fontSize: "1.1rem", opacity: 0.9 }}>
          Real-time incident reporting, tracking & resolution system for smart governance.
        </p>

        <div style={{ marginTop: "30px", fontSize: "0.95rem", opacity: 0.85 }}>
          ✔ AI-based Severity Prediction <br />
          ✔ Real-time Notifications <br />
          ✔ Department-wise Workflow <br />
          ✔ Live Incident Tracking
        </div>
      </div>

      {/* RIGHT SIDE - LOGIN */}
<div
  style={{
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
    background: "rgba(255,255,255,0.4)"
  }}
>
  <div
    style={{
      width: "100%",
      maxWidth: "430px",
      background: "rgba(255,255,255,0.75)",
      borderRadius: "18px",
      padding: "2.8rem",
      boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
      backdropFilter: "blur(14px)",
      border: "1px solid rgba(255,255,255,0.4)"
    }}
  >
    {/* HEADER */}
    <div className="text-center mb-4">
      <h2 style={{ fontWeight: "800", marginBottom: "5px" }}>
        Sign In
      </h2>
      <p style={{ fontSize: "0.95rem", color: "#666" }}>
        Access your incident dashboard
      </p>
    </div>

    {error && <Alert variant="danger">{error}</Alert>}

    <Form onSubmit={handleLogin}>
      {/* Username */}
      <Form.Group className="mb-3">
        <Form.Label style={{ fontWeight: "500" }}>
          Username
        </Form.Label>

        <Form.Control
          name="username"
          placeholder="Enter your username"
          required
          onChange={handleChange}
          style={{
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid #ddd",
            boxShadow: "none"
          }}
        />
      </Form.Group>

      {/* Password */}
      <Form.Group className="mb-2">
        <Form.Label style={{ fontWeight: "500" }}>
          Password
        </Form.Label>

        <InputGroup>
          <Form.Control
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            required
            onChange={handleChange}
            style={{
              padding: "12px",
              borderRadius: "12px 0 0 12px",
              border: "1px solid #ddd",
              boxShadow: "none"
            }}
          />

          <Button
            variant="light"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              borderRadius: "0 12px 12px 0",
              border: "1px solid #ddd"
            }}
          >
            {showPassword ? "Hide" : "Show"}
          </Button>
        </InputGroup>
      </Form.Group>

      {/* Forgot Password */}
      <div className="text-end mb-3">
        <Link
          to="/forgot-password"
          style={{
            fontSize: "0.85rem",
            textDecoration: "none",
            color: "#0d6efd",
            fontWeight: "500"
          }}
        >
          Forgot Password?
        </Link>
      </div>

      {/* LOGIN BUTTON */}
      <Button
        type="submit"
        className="w-100"
        disabled={loading}
        style={{
          padding: "12px",
          borderRadius: "12px",
          fontWeight: "600",
          background: "linear-gradient(135deg, #0d6efd, #0a58ca)",
          border: "none",
          boxShadow: "0 8px 20px rgba(13,110,253,0.25)"
        }}
      >
        {loading ? "Logging in..." : "Login"}
      </Button>
    </Form>

    {/* FOOTER */}
    <div className="text-center mt-4" style={{ fontSize: "0.9rem" }}>
      Don't have an account?{" "}
      <Link
        to="/signup"
        style={{
          fontWeight: "600",
          textDecoration: "none"
        }}
      >
        Register
      </Link>
    </div>
  </div>
</div>

    </div>
  );
}

export default Login;
