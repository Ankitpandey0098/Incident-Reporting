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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const token = localStorage.getItem("access");

      const response = await axios.post(
        "https://incident-reporting-rjwi.onrender.com/api/contact/",
        formData,
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {}
        }
      );

      setSuccessMsg(
        response.data.message || "Message sent successfully!"
      );

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });

    } catch (error) {
      console.error(error);

      setErrorMsg(
        error.response?.data?.error ||
        "Failed to send message. Try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        paddingTop: "40px",
        paddingBottom: "50px"
      }}
    >
      <Container>

        {/* HERO SECTION */}
        <Card
          className="border-0 shadow-lg mb-5"
          style={{
            borderRadius: "24px",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              background:
                "linear-gradient(135deg,#2563eb,#1e40af)",
              color: "#fff",
              padding: "60px 30px",
              textAlign: "center"
            }}
          >
            <h1
              style={{
                fontWeight: "800",
                marginBottom: "15px"
              }}
            >
              📩 Contact Us
            </h1>

            <p
              style={{
                maxWidth: "750px",
                margin: "auto",
                opacity: 0.9,
                fontSize: "1.05rem"
              }}
            >
              Have questions, suggestions, or need assistance?
              Our team is here to help you with the Incident
              Management Platform.
            </p>
          </div>
        </Card>

        <Row className="g-4">

          {/* CONTACT INFO */}
          <Col lg={5}>
            <Card
              className="border-0 shadow-sm h-100"
              style={{ borderRadius: "20px" }}
            >
              <Card.Body className="p-4">

                <h3 className="fw-bold mb-4">
                  Get In Touch
                </h3>

                <div className="mb-4">
                  <h6 className="fw-bold">
                    📧 Email
                  </h6>
                  <p className="text-muted mb-0">
                    pandeyji7112@gmail.com
                  </p>
                </div>

                <div className="mb-4">
                  <h6 className="fw-bold">
                    📞 Phone
                  </h6>
                  <p className="text-muted mb-0">
                    +91 8630435665
                  </p>
                </div>

                <div className="mb-4">
                  <h6 className="fw-bold">
                    📍 Location
                  </h6>
                  <p className="text-muted mb-0">
                    Delhi NCR, India
                  </p>
                </div>

                <hr />

                <p className="text-muted">
                  We usually respond within
                  <strong> 24 hours</strong>.
                  Your feedback helps us improve the platform.
                </p>

              </Card.Body>
            </Card>
          </Col>

          {/* CONTACT FORM */}
          <Col lg={7}>
            <Card
              className="border-0 shadow-sm"
              style={{
                borderRadius: "20px"
              }}
            >
              <Card.Body className="p-4">

                <h3 className="fw-bold mb-4">
                  Send a Message
                </h3>

                {successMsg && (
                  <Alert variant="success">
                    {successMsg}
                  </Alert>
                )}

                {errorMsg && (
                  <Alert variant="danger">
                    {errorMsg}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Name
                        </Form.Label>

                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your name"
                          required
                          style={{
                            borderRadius: "12px",
                            padding: "12px"
                          }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Email
                        </Form.Label>

                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email"
                          required
                          style={{
                            borderRadius: "12px",
                            padding: "12px"
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      Subject
                    </Form.Label>

                    <Form.Control
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Message subject"
                      required
                      style={{
                        borderRadius: "12px",
                        padding: "12px"
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>
                      Message
                    </Form.Label>

                    <Form.Control
                      as="textarea"
                      rows={6}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Write your message..."
                      required
                      style={{
                        borderRadius: "12px"
                      }}
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: "100%",
                      border: "none",
                      borderRadius: "12px",
                      padding: "12px",
                      fontWeight: "600",
                      background:
                        "linear-gradient(135deg,#2563eb,#1e40af)"
                    }}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>

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