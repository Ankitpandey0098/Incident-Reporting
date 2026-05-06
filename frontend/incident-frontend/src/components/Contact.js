import React, { useState } from "react";
import {
  Form,
  Button,
  Alert,
  Spinner,
  Container,
  Row,
  Col,
  Card
} from "react-bootstrap";
import axios from "axios";
import api from "../api/axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

   try {
  const token = localStorage.getItem("access");
  const response = await axios.post(
    "https://incident-reporting-rjwi.onrender.com/api/contact/",
    formData,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );


      setSuccessMsg(response.data.message || "Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error(error);
      setErrorMsg(
        error.response?.data?.error || "Failed to send message. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f9fa",
        paddingTop: "20px",
        paddingBottom: "30px",
        paddingLeft: "8px",
        paddingRight: "8px"
      }}
    >
      <Container className="px-2 px-md-3">
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6}>

            <Card className="shadow-sm border-0 rounded-3 p-2 p-md-3">
              <Card.Body className="p-3 p-md-4">

                {/* Header */}
                <div className="mb-4 text-center">
                  <h2 className="fw-bold text-dark mb-1 fs-5 fs-md-3">
                    📩 Contact Us
                  </h2>
                  <small className="text-muted d-block">
                    Have questions? We'd love to hear from you
                  </small>
                </div>

                {successMsg && (
                  <Alert variant="success">{successMsg}</Alert>
                )}

                {errorMsg && (
                  <Alert variant="danger">{errorMsg}</Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      size="sm"
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Subject</Form.Label>
                    <Form.Control
                      type="text"
                      name="subject"
                      placeholder="Enter subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="message"
                      rows={4}
                      placeholder="Write your message..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <div className="d-grid">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      disabled={loading}
                    >
                      {loading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </div>

                </Form>

              </Card.Body>
            </Card>

          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Contact;
