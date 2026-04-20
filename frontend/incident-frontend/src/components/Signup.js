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

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e) => {

    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {

      const res = await axios.post(
        "http://127.0.0.1:8000/api/register/",
        form
      );

      if (res.status === 200 || res.status === 201) {
        setSuccess(res.data.message || "Registration successful!");
        setTimeout(() => navigate("/login"), 1500);
      }

    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }

  };
return (

  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      background: "#f4f7fb"
    }}
  >

    {/* LEFT SIDE */}

    <div
      style={{
        flex: 1,
        background: "linear-gradient(135deg, #0fcad7, #70059a)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px"
      }}
    >

      <h2 style={{ fontWeight: "800" }}>
        Smart Incident Management
      </h2>

      <p style={{ opacity: 0.9, marginTop: "10px" }}>
        Create your account to report and manage incidents efficiently.
      </p>

      <div style={{ marginTop: "30px", opacity: 0.85 }}>
        🚨 Real-time Incident Reporting <br/>
        📊 Smart Analytics Dashboard <br/>
        🔔 Instant Notifications <br/>
        🏙️ Smart City Management
      </div>

    </div>

    {/* RIGHT SIDE */}

    <div
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px"
      }}
    >

      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "2.5rem",
          boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
        }}
      >

        <h2
          className="text-center mb-1"
          style={{ fontWeight: "700", color: "#111827" }}
        >
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

          <Form.Group className="mb-3">
            <Form.Label>Password*</Form.Label>

            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                required
                onChange={handleChange}
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
          </Form.Group>

          {/* Role */}

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

          {/* Department */}

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
            disabled={loading}
            style={{
              padding: "12px",
              fontWeight: 600,
              borderRadius: "10px"
            }}
          >
            {loading
              ? "Creating account..."
              : "Sign Up"}
          </Button>

        </Form>

        <div
          className="text-center mt-4"
          style={{
            fontSize: "0.95rem",
            color: "#374151",
          }}
        >
          Already registered?{" "}
          <Link to="/login">
            Login
          </Link>
        </div>

      </div>

    </div>

  </div>

);

}

export default Signup;
