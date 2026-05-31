// src/pages/About.js

import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button
} from "react-bootstrap";
import {
  FaShieldAlt,
  FaChartLine,
  FaUsers,
  FaBuilding,
  FaBolt,
  FaDatabase,
  FaCloud,
  FaMapMarkedAlt
} from "react-icons/fa";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div
      style={{
        background: "#f8fafc",
        minHeight: "100vh"
      }}
    >
      {/* HERO SECTION */}
      <section
        style={{
          background:
            "linear-gradient(135deg,#0f172a,#1e3a8a,#2563eb)",
          color: "white",
          padding: "90px 0"
        }}
      >
        <Container>

          <Row className="align-items-center">

            <Col lg={8}>
              <Badge
                bg="light"
                text="dark"
                className="mb-3 px-3 py-2"
              >
                Smart Incident Management Platform
              </Badge>

              <h1
                className="fw-bold mb-3"
                style={{
                  fontSize: "clamp(2.2rem,5vw,4rem)"
                }}
              >
                Transforming Incident Response
                Through Technology
              </h1>

              <p
                style={{
                  fontSize: "1.1rem",
                  opacity: 0.9,
                  maxWidth: "700px"
                }}
              >
                A centralized platform designed to help
                organizations, departments, campuses,
                and smart cities report, monitor,
                manage and resolve incidents efficiently.
              </p>

              <div className="mt-4">
                <Button
                  as={Link}
                  to="/signup"
                  size="lg"
                  variant="light"
                >
                  Get Started
                </Button>
              </div>
            </Col>

            <Col lg={4}>
              <Card
                className="border-0 shadow-lg"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(12px)",
                  color: "white"
                }}
              >
                <Card.Body>
                  <h5 className="fw-bold mb-3">
                    Platform Highlights
                  </h5>

                  <p>✔ Real-Time Reporting</p>
                  <p>✔ Department Routing</p>
                  <p>✔ Analytics Dashboard</p>
                  <p>✔ Smart City Monitoring</p>
                  <p className="mb-0">
                    ✔ Secure Role Management
                  </p>
                </Card.Body>
              </Card>
            </Col>

          </Row>

        </Container>
      </section>

      {/* STATS */}
      <Container className="py-5">

        <Row className="g-4 mb-5">

          <Col md={3}>
            <Card className="border-0 shadow-sm text-center h-100">
              <Card.Body>
                <FaUsers
                  size={40}
                  className="text-primary mb-3"
                />
                <h2 className="fw-bold">5000+</h2>
                <p className="text-muted mb-0">
                  Registered Users
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="border-0 shadow-sm text-center h-100">
              <Card.Body>
                <FaBuilding
                  size={40}
                  className="text-success mb-3"
                />
                <h2 className="fw-bold">50+</h2>
                <p className="text-muted mb-0">
                  Departments
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="border-0 shadow-sm text-center h-100">
              <Card.Body>
                <FaShieldAlt
                  size={40}
                  className="text-danger mb-3"
                />
                <h2 className="fw-bold">1000+</h2>
                <p className="text-muted mb-0">
                  Incidents Managed
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="border-0 shadow-sm text-center h-100">
              <Card.Body>
                <FaBolt
                  size={40}
                  className="text-warning mb-3"
                />
                <h2 className="fw-bold">24/7</h2>
                <p className="text-muted mb-0">
                  Monitoring
                </p>
              </Card.Body>
            </Card>
          </Col>

        </Row>

        {/* MISSION + VISION */}

        <Row className="g-4 mb-5">

          <Col md={6}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <h4 className="fw-bold mb-3">
                  🎯 Our Mission
                </h4>

                <p className="text-muted">
                  To simplify incident reporting,
                  improve emergency response,
                  and create transparent workflows
                  between citizens and departments.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <h4 className="fw-bold mb-3">
                  🚀 Our Vision
                </h4>

                <p className="text-muted">
                  To build safer organizations and
                  smarter cities through real-time
                  incident intelligence and analytics.
                </p>
              </Card.Body>
            </Card>
          </Col>

        </Row>

        {/* FEATURES */}

        <h2 className="fw-bold text-center mb-4">
          Powerful Features
        </h2>

        <Row className="g-4 mb-5">

          <Col md={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <FaShieldAlt
                  size={35}
                  className="text-primary mb-3"
                />
                <h5>Secure Access</h5>
                <p className="text-muted">
                  Role-based user management.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <FaChartLine
                  size={35}
                  className="text-success mb-3"
                />
                <h5>Analytics</h5>
                <p className="text-muted">
                  Powerful visual dashboards.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <FaMapMarkedAlt
                  size={35}
                  className="text-warning mb-3"
                />
                <h5>Live Tracking</h5>
                <p className="text-muted">
                  Geographic incident monitoring.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <FaUsers
                  size={35}
                  className="text-danger mb-3"
                />
                <h5>Collaboration</h5>
                <p className="text-muted">
                  Connect departments seamlessly.
                </p>
              </Card.Body>
            </Card>
          </Col>

        </Row>

        {/* TECH STACK */}

        <h2 className="fw-bold text-center mb-4">
          Technology Stack
        </h2>

        <Row className="g-4 mb-5">

          <Col md={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <FaCloud
                  size={35}
                  className="text-primary mb-3"
                />
                <h5>Frontend</h5>
                <p className="text-muted">
                  React.js, Bootstrap,
                  React Router, Axios
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <FaDatabase
                  size={35}
                  className="text-success mb-3"
                />
                <h5>Backend</h5>
                <p className="text-muted">
                  Django REST Framework,
                  JWT Authentication,
                  PostgreSQL
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <FaBolt
                  size={35}
                  className="text-warning mb-3"
                />
                <h5>Integrations</h5>
                <p className="text-muted">
                  Google Drive,
                  Charts,
                  Email Notifications
                </p>
              </Card.Body>
            </Card>
          </Col>

        </Row>

      </Container>

      {/* CTA */}

      <section
        style={{
          background:
            "linear-gradient(135deg,#1e3a8a,#2563eb)",
          color: "white",
          padding: "70px 0"
        }}
      >
        <Container className="text-center">
          <h2 className="fw-bold mb-3">
            Ready to Improve Incident Response?
          </h2>

          <p className="mb-4">
            Join our platform and experience
            smarter incident management.
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

export default About;