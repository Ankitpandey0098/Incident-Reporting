import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Alert, Container, Card } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

function SignupVerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    username: location.state?.username || localStorage.getItem("otp_username") || "",
    otp: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://incident-reporting-rjwi.onrender.com/api/signup-verify-otp/",
        form
      );

      setSuccess(res.data.message || "Account verified successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data?.error ||
        "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Card style={{ width: "400px", padding: "20px", borderRadius: "12px" }}>

        <h4 className="text-center mb-3">Verify Your Account</h4>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleVerify}>

          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
            name="username"
            value={form.username}
            readOnly
          />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>OTP</Form.Label>
            <Form.Control
            name="otp"
            value={form.otp}
            required
            onChange={handleChange}
          />
          </Form.Group>

          <Button
            type="submit"
            className="w-100"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify Account"}
          </Button>

        </Form>

      </Card>
    </Container>
  );
}

export default SignupVerifyOtp;