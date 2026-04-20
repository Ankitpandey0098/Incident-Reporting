import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

import IncidentCharts from "./IncidentCharts";
import IncidentHeatmap from "./IncidentHeatmap";
import LiveIncidentFeed from "./LiveIncidentFeed";

const AnalyticsDashboard = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: "20px",
        paddingBottom: "40px",
        background: "#f8f9fa"
      }}
    >
      <Container fluid="lg">

        {/* Page Header */}
        <div className="mb-4">
          <h2 className="fw-bold text-dark mb-1">
            📊 Analytics Dashboard
          </h2>
          <small className="text-muted">
            Monitor incidents, trends and real-time updates
          </small>
        </div>

        {/* Incident Statistics */}
        <Row className="mb-4">
          <Col md={12}>
            <Card className="shadow-sm border-0 rounded-3">
              <Card.Header className="fw-semibold bg-white border-0 py-3">
                📈 Incident Statistics
              </Card.Header>

              <Card.Body className="pt-2">
                <IncidentCharts />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Heatmap */}
        <Row className="mb-4">
          <Col md={12}>
            <Card className="shadow-sm border-0 rounded-3">
              <Card.Header className="fw-semibold bg-white border-0 py-3">
                🗺️ Incident Heatmap
              </Card.Header>

              <Card.Body className="pt-2">
                <IncidentHeatmap />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Live Feed */}
        <Row>
          <Col md={12}>
            <Card className="shadow-sm border-0 rounded-3">
              <Card.Header className="fw-semibold bg-white border-0 py-3">
                ⚡ Live Incident Feed
              </Card.Header>

              <Card.Body className="pt-2">
                <LiveIncidentFeed />
              </Card.Body>
            </Card>
          </Col>
        </Row>

      </Container>
    </div>
  );
};

export default AnalyticsDashboard;
