import React, { useState } from "react";
import { Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyOTP = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/verify-otp/",
        { email, otp }
      );

      setMessage(res.data.message || "OTP verified successfully");

      // Move to reset password page
      setTimeout(() => {
        navigate("/reset-password", {
          state: { email, otp },
        });
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Invalid or expired OTP"
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

    {/* LEFT PANEL */}

    <div
      style={{
        flex: 1,
        background: "linear-gradient(135deg, #1e3c72, #2a5298)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px"
      }}
    >

      <h2 style={{ fontWeight: "800" }}>
        OTP Verification
      </h2>

      <p style={{ opacity: 0.9, marginTop: "10px" }}>
        Enter the verification code sent to your email to continue password recovery.
      </p>

      <div style={{ marginTop: "30px", opacity: 0.85 }}>
        🔐 Secure OTP Verification <br/>
        ⚡ Fast Account Recovery <br/>
        🛡️ Protected Authentication
      </div>

    </div>

    {/* RIGHT PANEL */}

    <div
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px"
      }}
    >

      <Card
        className="shadow-lg"
        style={{
          width: "420px",
          borderRadius: "16px",
          border: "none"
        }}
      >

        <Card.Body className="p-4">

          <h4
            className="text-center mb-3"
            style={{ fontWeight: "700" }}
          >
            Verify OTP
          </h4>

          <p className="text-center text-muted mb-4">
            Enter the 6-digit code sent to your email
          </p>

          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>

            {/* Email */}

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ borderRadius: "10px" }}
              />
            </Form.Group>

            {/* OTP */}

            <Form.Group className="mb-3">
              <Form.Label>OTP</Form.Label>
              <Form.Control
                type="text"
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                style={{ 
                  borderRadius: "10px",
                  letterSpacing: "4px",
                  fontSize: "18px",
                  textAlign: "center"
                }}
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100"
              disabled={loading}
              style={{
                borderRadius: "10px",
                fontWeight: "600",
                padding: "10px"
              }}
            >
              {loading ? <Spinner size="sm" /> : "Verify OTP"}
            </Button>

          </Form>

        </Card.Body>

      </Card>

    </div>

  </div>

);

};

export default VerifyOTP;
