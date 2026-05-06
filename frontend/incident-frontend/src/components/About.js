// src/pages/About.js
import React from "react";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";

const About = () => {
  return (
    <Container className="py-4 px-3 px-md-4" style={{ minHeight: "100vh" }}>

      {/* Header */}
      <Row className="mb-5">
        <Col>
          <Card className="shadow-sm border-0 p-3 p-md-4">
            <h1 className="fw-bold text-primary fs-3 fs-md-2">
              🚨 Incident Management Platform
            </h1>
            <p className="text-muted fs-6 fs-md-5 mt-2">
              This Incident Management Platform is designed to help users report, track,
              and manage various types of incidents efficiently. It allows authorities
              and emergency services to respond quickly while providing analytics for
              better decision-making.
            </p>

            <div className="mt-3 d-flex flex-wrap gap-2">
              <Badge bg="primary" className="me-2">Real-Time</Badge>
              <Badge bg="success" className="me-2">Analytics</Badge>
              <Badge bg="warning" className="me-2">AI Classification</Badge>
              <Badge bg="dark">Secure</Badge>
            </div>

          </Card>
        </Col>
      </Row>

      {/* Objectives */}
      <Row className="mb-5">
        <Col xs={12} md={6} className="mb-3 mb-md-0">
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <Card.Title className="fw-bold mb-3">
                🎯 Objectives
              </Card.Title>

              <ul className="text-muted ps-3">
                <li>
                  Enable users to report incidents like accidents, floods,
                  fires, and cyber crimes.
                </li>

                <li>
                  Provide real-time updates to administrators and emergency services.
                </li>

                <li>
                  Maintain a detailed activity timeline for each incident.
                </li>

                <li>
                  Generate statistics and visualizations for better analysis.
                </li>

              </ul>

            </Card.Body>
          </Card>
        </Col>

        {/* Features */}
        <Col xs={12} md={6} className="mb-3 mb-md-0">
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>

              <Card.Title className="fw-bold mb-3">
                ⚡ Key Features
              </Card.Title>

              <ul className="text-muted">
                <li>User authentication and role-based access control</li>
                <li>Admin dashboard with category and status management</li>
                <li>Automated incident classification with confidence scores</li>
                <li>Real-time incident updates with polling</li>
                <li>Attachment support for images and documents</li>
                <li>Search and filter functionality</li>
                <li>Visual analytics through charts</li>
              </ul>

            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Technology Stack */}
      <Row className="mb-4 mb-md-5">
        <Col>

          <Card className="shadow-sm border-0">

            <Card.Body>

              <Card.Title className="fw-bold mb-4">
                🛠️ Technology Stack
              </Card.Title>

              <Row>

                <Col xs={12} sm={6} md={4} className="mb-3">
                  <Card className="border-0 bg-light h-100">
                    <Card.Body>
                      <h6 className="fw-bold text-primary mb-3">
                        Frontend
                      </h6>

                      <ul className="text-muted">
                        <li>React.js</li>
                        <li>Bootstrap 5 / React-Bootstrap</li>
                        <li>Axios for API calls</li>
                      </ul>

                    </Card.Body>
                  </Card>
                </Col>

                <Col xs={12} sm={6} md={4} className="mb-3">
                  <Card className="border-0 bg-light h-100">
                    <Card.Body>

                      <h6 className="fw-bold text-success mb-3">
                        Backend
                      </h6>

                      <ul className="text-muted">
                        <li>Django & Django REST Framework</li>
                        <li>JWT Authentication</li>
                        <li>SQLite / PostgreSQL</li>
                      </ul>

                    </Card.Body>
                  </Card>
                </Col>

                <Col xs={12} sm={6} md={4} className="mb-3">
                  <Card className="border-0 bg-light h-100">
                    <Card.Body>

                      <h6 className="fw-bold text-warning mb-3">
                        Other Tools
                      </h6>

                      <ul className="text-muted">
                        <li>Day.js for timestamps</li>
                        <li>Google Drive API for uploads</li>
                        <li>Charts.js / React Charts</li>
                      </ul>

                    </Card.Body>
                  </Card>
                </Col>

              </Row>

            </Card.Body>

          </Card>

        </Col>
      </Row>

      {/* Call to Action */}
      <Row className="mb-5">
        <Col>
          <Card className="shadow-sm border-0 text-center p-3 p-md-4">

            <Card.Body>

              <Card.Title className="fw-bold mb-3 fs-6 fs-md-5">
                🚀 Get Started
              </Card.Title>

              <p className="text-muted fs-6 fs-md-5">
                Users can register to report incidents, while admins can manage
                incident categories, statuses, and view analytics to make
                informed decisions.
              </p>

              <div className="mt-3 d-flex flex-wrap gap-2">
                <Badge bg="primary" className="me-2">
                  User Reporting
                </Badge>

                <Badge bg="success" className="me-2">
                  Admin Dashboard
                </Badge>

                <Badge bg="dark">
                  Analytics
                </Badge>
              </div>

            </Card.Body>

          </Card>
        </Col>
      </Row>

    </Container>
  );
};

export default About;
