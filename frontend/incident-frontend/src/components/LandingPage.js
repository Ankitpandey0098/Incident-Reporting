import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

import {
  FaExclamationTriangle,
  FaChartLine,
  FaBuilding,
  FaMapMarkedAlt,
  FaShieldAlt,
  FaUsers,
} from "react-icons/fa";

const LandingPage = () => {
  return (
    <div>

      {/* HERO SECTION */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)",
          color: "white",
          padding: "120px 0 100px",
        }}
      >
        <Container>
          <Row className="align-items-center">

            <Col lg={7}>
              <span
                style={{
                  background: "rgba(255,255,255,0.15)",
                  padding: "8px 16px",
                  borderRadius: "30px",
                  fontSize: "14px",
                }}
              >
                🚨 Smart Incident Management Platform
              </span>

              <h1
                className="fw-bold mt-4"
                style={{
                  fontSize: "clamp(2.5rem,5vw,4.5rem)",
                  lineHeight: "1.2",
                }}
              >
                Report, Track & Resolve Incidents Efficiently
              </h1>

              <p
                className="mt-4"
                style={{
                  fontSize: "1.15rem",
                  opacity: "0.9",
                  maxWidth: "700px",
                }}
              >
                Empowering organizations, departments, and smart cities with
                real-time incident reporting, analytics, monitoring, and
                resolution management.
              </p>

              <div className="mt-4">
                <Button
                  as={Link}
                  to="/signup"
                  variant="light"
                  size="lg"
                  className="me-3"
                >
                  Get Started
                </Button>

                <Button
                  as={Link}
                  to="/login"
                  variant="outline-light"
                  size="lg"
                >
                  Login
                </Button>
              </div>
            </Col>

            <Col lg={5} className="mt-5 mt-lg-0">
              <Card
                className="border-0 shadow-lg"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(15px)",
                  color: "white",
                }}
              >
                <Card.Body className="p-4">
                  <h4 className="fw-bold mb-4">Platform Highlights</h4>

                  <div className="mb-3">✔ Real-Time Incident Tracking</div>
                  <div className="mb-3">✔ Department Workflow Management</div>
                  <div className="mb-3">✔ Analytics Dashboard</div>
                  <div className="mb-3">✔ Smart City Monitoring</div>
                  <div>✔ Secure & Role-Based Access Control</div>
                </Card.Body>
              </Card>
            </Col>

          </Row>
        </Container>
      </section>

      {/* STATISTICS */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="g-4">

            <Col md={3}>
              <Card className="border-0 shadow-sm text-center h-100">
                <Card.Body>
                  <FaExclamationTriangle
                    size={40}
                    className="text-danger mb-3"
                  />
                  <h2 className="fw-bold">1000+</h2>
                  <p className="text-muted mb-0">Incidents Managed</p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3}>
              <Card className="border-0 shadow-sm text-center h-100">
                <Card.Body>
                  <FaBuilding size={40} className="text-primary mb-3" />
                  <h2 className="fw-bold">50+</h2>
                  <p className="text-muted mb-0">Departments Connected</p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3}>
              <Card className="border-0 shadow-sm text-center h-100">
                <Card.Body>
                  <FaUsers size={40} className="text-success mb-3" />
                  <h2 className="fw-bold">5000+</h2>
                  <p className="text-muted mb-0">Users Registered</p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3}>
              <Card className="border-0 shadow-sm text-center h-100">
                <Card.Body>
                  <FaShieldAlt size={40} className="text-warning mb-3" />
                  <h2 className="fw-bold">24/7</h2>
                  <p className="text-muted mb-0">Monitoring</p>
                </Card.Body>
              </Card>
            </Col>

          </Row>
        </Container>
      </section>

      {/* ABOUT */}
      <section className="py-5">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center">
              <h2 className="fw-bold mb-4">
                About Incident Platform
              </h2>

              <p className="lead text-muted">
                Incident Platform is a centralized system designed for
                organizations, government departments, campuses, and smart city
                projects to report, monitor, assign, and resolve incidents
                efficiently.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* FEATURES */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center fw-bold mb-5">
            Powerful Features
          </h2>

          <Row className="g-4">

            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <FaExclamationTriangle
                    size={35}
                    className="text-danger mb-3"
                  />
                  <h5>Incident Reporting</h5>
                  <p className="text-muted">
                    Quickly report incidents with evidence and location details.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <FaChartLine
                    size={35}
                    className="text-success mb-3"
                  />
                  <h5>Analytics Dashboard</h5>
                  <p className="text-muted">
                    Visualize trends, performance, and response metrics.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <FaBuilding
                    size={35}
                    className="text-primary mb-3"
                  />
                  <h5>Department Management</h5>
                  <p className="text-muted">
                    Route incidents to the correct teams instantly.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <FaMapMarkedAlt
                    size={35}
                    className="text-warning mb-3"
                  />
                  <h5>Smart City Monitoring</h5>
                  <p className="text-muted">
                    Monitor incidents geographically across city regions.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <FaShieldAlt
                    size={35}
                    className="text-info mb-3"
                  />
                  <h5>Secure Access Control</h5>
                  <p className="text-muted">
                    Role-based access for Admins, Departments, and Users.
                  </p>
                </Card.Body>
              </Card>
            </Col>

          </Row>
        </Container>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-5">
        <Container>
          <h2 className="text-center fw-bold mb-5">
            How It Works
          </h2>

          <Row className="text-center g-4">
            <Col md={2}><h5>1. Sign Up</h5></Col>
            <Col md={2}><h5>2. Login</h5></Col>
            <Col md={3}><h5>3. Report Incident</h5></Col>
            <Col md={2}><h5>4. Track Progress</h5></Col>
            <Col md={3}><h5>5. Resolution</h5></Col>
          </Row>
        </Container>
      </section>

      {/* CTA */}
      <section
        className="py-5 text-center"
        style={{
          background:
            "linear-gradient(135deg,#1e3a8a,#2563eb)",
          color: "white",
        }}
      >
        <Container>
          <h2 className="fw-bold mb-3">
            Ready to Improve Incident Response?
          </h2>

          <p className="mb-4">
            Join the platform and start managing incidents smarter today.
          </p>

          <Button
            as={Link}
            to="/signup"
            size="lg"
            variant="light"
          >
            Create Account
          </Button>
        </Container>
      </section>

    </div>
  );
};

export default LandingPage;