import React, { useState } from "react";
import axios from "axios";
import {
  Form,
  Button,
  Alert,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function Signup() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    role: "user",
    department: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [passwordRules, setPasswordRules] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const validatePassword = (password) => {
    const rules = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    setPasswordRules(rules);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // 🔥 Password validation guard
    const isPasswordValid = Object.values(passwordRules).every(Boolean);

    if (!isPasswordValid) {
      setError("Please enter a strong password");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "https://incident-reporting-rjwi.onrender.com/api/register/",
        form
      );

      if (res.status === 200 || res.status === 201) {
        setSuccess(res.data.message || "Registration successful!");
        setTimeout(() => {
  navigate("/signup-verify-otp", {
    state: {
      username: form.username
    }
  });
}, 1500);
      }

    } catch (err) {

  if (err.response?.data) {

    const errors = err.response.data;

    const firstKey = Object.keys(errors)[0];

    const firstError = errors[firstKey];

    if (Array.isArray(firstError)) {
      setError(firstError[0]);
    } else {
      setError(firstError);
    }

  } else {
    setError("Registration failed");
  }


    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#f4f7fb" }}>

      {/* LEFT SIDE */}
      <div style={{
        flex: 1,
        background: "linear-gradient(135deg, #0fcad7, #70059a)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px"
      }}>
        <h2 style={{ fontWeight: "800" }}>
          Smart Incident Management
        </h2>

        <p style={{ opacity: 0.9, marginTop: "10px" }}>
          Create your account to report and manage incidents efficiently.
        </p>

        <div style={{ marginTop: "30px", opacity: 0.85 }}>
          🚨 Real-time Incident Reporting <br />
          📊 Smart Analytics Dashboard <br />
          🔔 Instant Notifications <br />
          🏙️ Smart City Management
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px"
      }}>
        <div style={{
          width: "100%",
          maxWidth: "520px",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "2.5rem",
          boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
        }}>

          <h2 className="text-center mb-1" style={{ fontWeight: "700", color: "#111827" }}>
            Create Account
          </h2>

          <p className="text-center text-muted mb-4">
            Join the Smart Incident Platform
          </p>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSignup}>

            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>First Name*</Form.Label>
                <Form.Control
                  name="first_name"
                  required
                  onChange={handleChange}
                  style={{ borderRadius: "10px" }}
                />
              </Col>

              <Col md={6} className="mb-3">
                <Form.Label>Last Name*</Form.Label>
                <Form.Control
                  name="last_name"
                  required
                  onChange={handleChange}
                  style={{ borderRadius: "10px" }}
                />
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Email*</Form.Label>
              <Form.Control
                type="email"
                name="email"
                required
                onChange={handleChange}
                style={{ borderRadius: "10px" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Username*</Form.Label>
              <Form.Control
                name="username"
                required
                onChange={handleChange}
                style={{ borderRadius: "10px" }}
              />
            </Form.Group>

            {/* PASSWORD */}
            <Form.Group className="mb-3">
              <Form.Label>Password*</Form.Label>

              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  onChange={(e) => {
                    handleChange(e);
                    validatePassword(e.target.value);
                  }}
                  style={{ borderRadius: "10px 0 0 10px" }}
                />

                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </InputGroup>

              {/* PASSWORD RULES */}
              <div style={{ fontSize: "0.85rem", marginTop: "8px" }}>
                <div style={{ color: passwordRules.length ? "green" : "red" }}>
                  • At least 8 characters
                </div>
                <div style={{ color: passwordRules.uppercase ? "green" : "red" }}>
                  • 1 uppercase letter
                </div>
                <div style={{ color: passwordRules.lowercase ? "green" : "red" }}>
                  • 1 lowercase letter
                </div>
                <div style={{ color: passwordRules.number ? "green" : "red" }}>
                  • 1 number
                </div>
                <div style={{ color: passwordRules.special ? "green" : "red" }}>
                  • 1 special character
                </div>
              </div>
            </Form.Group>

            {/* ROLE */}
            <Form.Group className="mb-3">
              <Form.Label>Register As*</Form.Label>
              <Form.Select
                name="role"
                onChange={handleChange}
                style={{ borderRadius: "10px" }}
              >
                <option value="user">User</option>
                <option value="department">Department</option>
              </Form.Select>
            </Form.Group>

            {/* DEPARTMENT */}
            {form.role === "department" && (
              <Form.Group className="mb-4">
                <Form.Label>Select Department*</Form.Label>

                <Form.Select
                  name="department"
                  onChange={handleChange}
                  required
                  style={{ borderRadius: "10px" }}
                >
                  <option value="">Choose Department</option>
                  <option value="Disaster Management">Disaster Management</option>
                  <option value="Emergency Services">Emergency Services</option>
                  <option value="Electricity Department">Electricity Department</option>
                  <option value="Cyber Crime Cell">Cyber Crime Cell</option>
                  <option value="Police Department">Police Department</option>
                  <option value="Fire Department">Fire Department</option>
                  <option value="Parks & Recreation">Parks & Recreation</option>
                  <option value="Wildlife / Animal Control">Wildlife / Animal Control</option>
                  <option value="Health Department">Health Department</option>
                  <option value="Pollution">Pollution</option>
                  <option value="Municipality">Municipality</option>
                  <option value="Traffic / Roads">Traffic / Roads</option>
                  <option value="Forest">Forest</option>
                  <option value="Waste Management">Waste Management</option>
                  <option value="Water Management">Water Management</option>
                </Form.Select>
              </Form.Group>
            )}

            <Button
              type="submit"
              className="w-100"
              disabled={
                loading || !Object.values(passwordRules).every(Boolean)
              }
              style={{
                padding: "12px",
                fontWeight: 600,
                borderRadius: "10px"
              }}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </Button>

          </Form>

          <div className="text-center mt-4" style={{ fontSize: "0.95rem", color: "#374151" }}>
            Already registered?{" "}
            <Link to="/login">Login</Link>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Signup;