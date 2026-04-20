import React, { useState, useEffect } from "react";
import { Card, Form, Button, Alert, Spinner, Container, ProgressBar, Badge } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
const OTP_EXPIRY_SECONDS = 300;

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = () => {
    const min = Math.floor(timer / 60);
    const sec = timer % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(
  "https://incident-reporting-rjwi.onrender.com/api/auth/forgot-password/",
  { email }
);


      setMessage(res.data.message);
      setStep(2);
      setTimer(OTP_EXPIRY_SECONDS);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(
  "https://incident-reporting-rjwi.onrender.com/api/auth/forgot-password/",
  { email }
);

      setMessage("OTP resent successfully");
      setTimer(OTP_EXPIRY_SECONDS);
    } catch (err) {
      setError("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(
  "https://incident-reporting-rjwi.onrender.com/api/auth/verify-otp/",
  { email, otp }
);

      setMessage(res.data.message);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(
  "https://incident-reporting-rjwi.onrender.com/api/auth/reset-password/",
  { email, otp, password }
);


      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  const stepProgress = (step / 3) * 100;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eef2f7, #dfe9f3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <Container>
        <Card
          className="shadow-lg border-0"
          style={{
            maxWidth: "450px",
            margin: "auto",
            borderRadius: "15px",
            overflow: "hidden",
          }}
        >
          <div className="p-3 text-center bg-primary text-white">
            <h5 className="mb-0">Forgot Password</h5>
            <small>Secure OTP Verification</small>
          </div>

          <Card.Body className="p-4">

            <ProgressBar now={stepProgress} className="mb-3" />

            <div className="text-center mb-3">
              <Badge bg={step >= 1 ? "primary" : "secondary"} className="mx-1">Email</Badge>
              <Badge bg={step >= 2 ? "primary" : "secondary"} className="mx-1">OTP</Badge>
              <Badge bg={step >= 3 ? "primary" : "secondary"} className="mx-1">Reset</Badge>
            </div>

            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            {/* STEP 1 */}
            {step === 1 && (
              <Form onSubmit={sendOtp}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button className="w-100 rounded-pill" type="submit" disabled={loading}>
                  {loading ? <Spinner size="sm" /> : "Send OTP"}
                </Button>
              </Form>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <Form onSubmit={verifyOtp}>
                <Form.Group className="mb-3">
                  <Form.Label>Enter OTP</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <small className="text-muted">
                    Expires in: <b>{formatTime()}</b>
                  </small>

                  <Button
                    variant="link"
                    className="p-0"
                    disabled={timer > 0 || loading}
                    onClick={resendOtp}
                  >
                    Resend OTP
                  </Button>
                </div>

                <Button className="w-100 rounded-pill" type="submit" disabled={loading}>
                  {loading ? <Spinner size="sm" /> : "Verify OTP"}
                </Button>
              </Form>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <Form onSubmit={resetPassword}>
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button className="w-100 rounded-pill" type="submit" disabled={loading}>
                  {loading ? <Spinner size="sm" /> : "Reset Password"}
                </Button>
              </Form>
            )}

          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default ForgotPassword;
