import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="py-5 text-center">
        <Container>
          <h1 className="display-4 fw-bold">
            Smart Incident Management Platform
          </h1>

          <p className="lead mt-3">
            Report, Track and Resolve Incidents Efficiently with Real-Time
            Monitoring and Analytics.
          </p>

          <div className="mt-4">
            <Button
              as={Link}
              to="/signup"
              variant="primary"
              size="lg"
              className="me-3"
            >
              Get Started
            </Button>

            <Button
              as={Link}
              to="/login"
              variant="outline-primary"
              size="lg"
            >
              Login
            </Button>
          </div>
        </Container>
      </section>

      {/* About Section */}
      <section className="py-5">
        <Container>
          <Row>
            <Col>
              <h2 className="mb-4">About Incident Platform</h2>

              <p>
                Incident Platform is a centralized solution designed to help
                organizations, departments, and smart city teams efficiently
                manage incidents from reporting to resolution.
              </p>

              <p>
                The platform improves transparency, accountability, and response
                time through automation, analytics, and real-time tracking.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features */}
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-5">Platform Features</h2>

          <Row className="g-4">
            <Col md={4}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>Incident Reporting</Card.Title>
                  <Card.Text>
                    Submit incidents quickly with complete details and evidence.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>Real-Time Tracking</Card.Title>
                  <Card.Text>
                    Monitor incident status from creation to resolution.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>Analytics Dashboard</Card.Title>
                  <Card.Text>
                    Gain insights through charts, trends, and reporting data.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>Department Management</Card.Title>
                  <Card.Text>
                    Route incidents to the correct departments for action.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>Smart City Monitoring</Card.Title>
                  <Card.Text>
                    Support city-wide monitoring and response management.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-5">How It Works</h2>

          <Row className="text-center">
            <Col md={2}>
              <h5>1. Sign Up</h5>
            </Col>

            <Col md={2}>
              <h5>2. Login</h5>
            </Col>

            <Col md={3}>
              <h5>3. Report Incident</h5>
            </Col>

            <Col md={2}>
              <h5>4. Track Progress</h5>
            </Col>

            <Col md={3}>
              <h5>5. Resolution</h5>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact */}
      <section className="py-5">
        <Container>
          <h2>Contact Information</h2>

          <p>Email: support@incidentplatform.com</p>
          <p>Phone: +91 XXXXX XXXXX</p>
          <p>Address: Incident Management Center</p>
        </Container>
      </section>
    </>
  );
};

export default LandingPage;