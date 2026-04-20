import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner, Alert, Badge, Container } from "react-bootstrap";
import axios from "axios";
import api from "../api/axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Pie, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const IncidentCharts = () => {
  const role = localStorage.getItem("role");
  const [categoryData, setCategoryData] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [departmentData, setDepartmentData] = useState(null);
  const [timelineData, setTimelineData] = useState(null);
  

  const [riskAlerts, setRiskAlerts] = useState([]);

  const [summary, setSummary] = useState({
    total: 0,
    pending: 0,
    progress: 0,
    resolved: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const requestWithToken = async (url) => {
    let access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");

    try {
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${access}` },
      });
      return res.data;
    } catch (err) {
      if (err.response?.status === 401 && refresh) {
        const tokenRes = await axios.post(
  "https://incident-reporting-rjwi.onrender.com/api/token/refresh/",
  { refresh }
);


        access = tokenRes.data.access;
        localStorage.setItem("access", access);

        const retry = await axios.get(url, {
          headers: { Authorization: `Bearer ${access}` },
        });

        return retry.data;
      }

      throw err;
    }
  };

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        setLoading(true);

        const catRes = await requestWithToken(
  "https://incident-reporting-rjwi.onrender.com/api/analytics/category/"
);

const statRes = await requestWithToken(
  "https://incident-reporting-rjwi.onrender.com/api/analytics/status/"
);

const deptRes = await requestWithToken(
  "https://incident-reporting-rjwi.onrender.com/api/analytics/departments/"
);

const timeRes = await requestWithToken(
  "https://incident-reporting-rjwi.onrender.com/api/analytics/timeline/"
);

const riskRes = await requestWithToken(
  "https://incident-reporting-rjwi.onrender.com/api/analytics/risk-alerts/"
);


        setRiskAlerts(riskRes || []);

        if (Array.isArray(catRes)) {
          setCategoryData({
            labels: catRes.map((i) => i.category),
            datasets: [{
              label: "Incidents",
              data: catRes.map((i) => i.count),
              backgroundColor: ["#0d6efd", "#dc3545", "#ffc107", "#198754", "#6f42c1"],
              borderRadius: 8,
            }],
          });
        }

        if (Array.isArray(statRes)) {

          const pending = statRes.find((i) => i.status.toLowerCase() === "pending")?.count || 0;
          const progress = statRes.find((i) => i.status.toLowerCase() === "in progress")?.count || 0;
          const resolved = statRes.find((i) => i.status.toLowerCase() === "resolved")?.count || 0;

          setSummary({
            total: pending + progress + resolved,
            pending,
            progress,
            resolved,
          });

          setStatusData({
            labels: statRes.map((i) => i.status),
            datasets: [{
              data: statRes.map((i) => i.count),
              backgroundColor: ["#ffc107", "#0d6efd", "#198754"],
            }],
          });
        }

        if (Array.isArray(deptRes)) {
          setDepartmentData({
            labels: deptRes.map((i) => i.department),
            datasets: [{
              data: deptRes.map((i) => i.count),
              backgroundColor: ["#0d6efd", "#dc3545", "#ffc107", "#198754", "#6f42c1", "#fd7e14"],
            }],
          });
        }

        if (Array.isArray(timeRes)) {
          setTimelineData({
            labels: timeRes.map((i) => i.date),
            datasets: [{
              label: "Incidents",
              data: timeRes.map((i) => i.count),
              borderColor: "#0d6efd",
              tension: 0.3,
            }],
          });
        }

      } catch (err) {
        setError("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchCharts();
    const interval = setInterval(fetchCharts, 30000);
    return () => clearInterval(interval);
  }, []);

  const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "bottom" }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        precision: 0
      }
    }
  }
};

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "bottom" }
  }
};



  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container fluid style={{ padding: "20px" }}>

      {/* ================= RISK ALERTS ================= */}
      {riskAlerts.length > 0 && (
        <Card className="mb-4 shadow-sm border-0">
          <Card.Header style={{ background: "#dc3545", color: "white", fontWeight: "600" }}>
            🚨 Risk Alerts
          </Card.Header>

          <Card.Body>
            {riskAlerts.map((alert, index) => (
              <Alert key={index} variant="warning" className="mb-2 d-flex justify-content-between align-items-center">
                <span>⚠ {alert.message}</span>
                <Badge bg="danger">{alert.count}</Badge>
              </Alert>
            ))}
          </Card.Body>
        </Card>
      )}

      {/* ================= KPI CARDS ================= */}
      <Row className="mb-4 g-3">

        {[
          { label: "Total", value: summary.total, color: "dark" },
          { label: "Pending", value: summary.pending, color: "warning" },
          { label: "In Progress", value: summary.progress, color: "primary" },
          { label: "Resolved", value: summary.resolved, color: "success" },
        ].map((item, idx) => (
          <Col md={3} key={idx}>
            <Card className="shadow-sm border-0 text-center h-100">
              <Card.Body>
                <h6 className="text-muted">{item.label}</h6>
                <h3 className={`text-${item.color}`}>{item.value}</h3>
              </Card.Body>
            </Card>
          </Col>
        ))}

      </Row>

      {/* ================= CHARTS ================= */}
      <Row className="g-4">

        <Col md={role === "admin" ? 4 : 6}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white fw-semibold">Category</Card.Header>
            <Card.Body style={{ height: 300 }}>
              {categoryData ? <Bar data={categoryData} options={barOptions} /> : <p>No data</p>}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white fw-semibold">Status</Card.Header>
            <Card.Body style={{ height: 300 }}>
              {statusData ? <Pie data={statusData} options={pieOptions} /> : <p>No data</p>}
            </Card.Body>
          </Card>
        </Col>

        {role === "admin" && (
<Col md={4}>
  <Card className="shadow-sm border-0">
    <Card.Header className="bg-white fw-semibold">Department</Card.Header>
    <Card.Body style={{ height: 300 }}>
      {departmentData ? <Doughnut data={departmentData} options={pieOptions} /> : <p>No data</p>}
    </Card.Body>
  </Card>
</Col>
)}


      </Row>

      {/* ================= TIMELINE ================= */}
      <Row className="mt-4">
        <Col md={12}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white fw-semibold">Incident Trend</Card.Header>
            <Card.Body style={{ height: 350 }}>
              {timelineData ? <Line data={timelineData} options={barOptions} /> : <p>No data</p>}
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </Container>
  );
};

export default IncidentCharts;
