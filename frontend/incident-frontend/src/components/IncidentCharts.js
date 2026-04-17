import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner, Alert, Badge } from "react-bootstrap";
import axios from "axios";

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

/* ================= REGISTER CHART ================= */
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

  /* ================= TOKEN HELPER ================= */
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
          "http://127.0.0.1:8000/api/token/refresh/",
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

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchCharts = async () => {
      try {
        setLoading(true);

        const catRes = await requestWithToken(
          "http://127.0.0.1:8000/api/analytics/category/"
        );

        const statRes = await requestWithToken(
          "http://127.0.0.1:8000/api/analytics/status/"
        );

        const deptRes = await requestWithToken(
          "http://127.0.0.1:8000/api/analytics/departments/"
        );

        const timeRes = await requestWithToken(
          "http://127.0.0.1:8000/api/analytics/timeline/"
        );

        const riskRes = await requestWithToken(
          "http://127.0.0.1:8000/api/analytics/risk-alerts/"
        );

        setRiskAlerts(riskRes || []);

        /* ================= CATEGORY ================= */
        if (Array.isArray(catRes) && catRes.length) {
          setCategoryData({
            labels: catRes.map((i) => i.category),
            datasets: [
              {
                label: "Incidents",
                data: catRes.map((i) => i.count),
                backgroundColor: [
                  "#0d6efd",
                  "#dc3545",
                  "#ffc107",
                  "#198754",
                  "#6f42c1",
                ],
                borderRadius: 8,
              },
            ],
          });
        }

        /* ================= STATUS ================= */
        if (Array.isArray(statRes) && statRes.length) {
          const pending =
            statRes.find((i) => i.status.toLowerCase() === "pending")?.count ||
            0;

          const progress =
            statRes.find((i) => i.status.toLowerCase() === "in progress")
              ?.count || 0;

          const resolved =
            statRes.find((i) => i.status.toLowerCase() === "resolved")?.count ||
            0;

          const total = pending + progress + resolved;

          setSummary({
            total,
            pending,
            progress,
            resolved,
          });

          setStatusData({
            labels: statRes.map((i) => i.status),
            datasets: [
              {
                data: statRes.map((i) => i.count),
                backgroundColor: ["#ffc107", "#0d6efd", "#198754"],
              },
            ],
          });
        }

        /* ================= DEPARTMENTS ================= */
        if (Array.isArray(deptRes) && deptRes.length) {
          setDepartmentData({
            labels: deptRes.map((i) => i.department),
            datasets: [
              {
                data: deptRes.map((i) => i.count),
                backgroundColor: [
                  "#0d6efd",
                  "#dc3545",
                  "#ffc107",
                  "#198754",
                  "#6f42c1",
                  "#fd7e14",
                ],
              },
            ],
          });
        }

        /* ================= TIMELINE ================= */
        if (Array.isArray(timeRes) && timeRes.length) {
          setTimelineData({
            labels: timeRes.map((i) => i.date),
            datasets: [
              {
                label: "Incidents",
                data: timeRes.map((i) => i.count),
                fill: false,
                borderColor: "#0d6efd",
                tension: 0.3,
              },
            ],
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

  /* ================= OPTIONS ================= */
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 16,
        },
      },
    },
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <>
      {/* ================= RISK ALERTS ================= */}
      {riskAlerts.length > 0 && (
        <Card className="mb-4 shadow-sm border-danger">
          <Card.Header className="bg-danger text-white fw-semibold">
            🚨 Risk Alerts
          </Card.Header>

          <Card.Body>
            {riskAlerts.map((alert, index) => (
              <Alert key={index} variant="warning" className="mb-2">
                ⚠ {alert.message}{" "}
                <Badge bg="danger">{alert.count}</Badge>
              </Alert>
            ))}
          </Card.Body>
        </Card>
      )}

      {/* ================= KPI CARDS ================= */}
      <Row className="mb-4 g-3">
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h6>Total Incidents</h6>
              <h3>{summary.total}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="text-center shadow-sm border-warning">
            <Card.Body>
              <h6>Pending</h6>
              <h3 className="text-warning">{summary.pending}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="text-center shadow-sm border-primary">
            <Card.Body>
              <h6>In Progress</h6>
              <h3 className="text-primary">{summary.progress}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="text-center shadow-sm border-success">
            <Card.Body>
              <h6>Resolved</h6>
              <h3 className="text-success">{summary.resolved}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ================= CHARTS ================= */}
      <Row className="g-4">

        <Col md={4}>
          <Card className="shadow-sm h-100">
            <Card.Header className="fw-semibold bg-white">
              Incidents by Category
            </Card.Header>
            <Card.Body style={{ height: 320 }}>
              {categoryData ? (
                <Bar data={categoryData} options={chartOptions} />
              ) : (
                <p className="text-muted text-center mt-5">
                  No category data available
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm h-100">
            <Card.Header className="fw-semibold bg-white">
              Incidents by Status
            </Card.Header>
            <Card.Body style={{ height: 320 }}>
              {statusData ? (
                <Pie data={statusData} options={chartOptions} />
              ) : (
                <p className="text-muted text-center mt-5">
                  No status data available
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm h-100">
            <Card.Header className="fw-semibold bg-white">
              Incidents by Department
            </Card.Header>
            <Card.Body style={{ height: 320 }}>
              {departmentData ? (
                <Doughnut data={departmentData} options={chartOptions} />
              ) : (
                <p className="text-muted text-center mt-5">
                  No department data available
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>

      </Row>

      {/* ================= TIMELINE ================= */}

      <Row className="mt-4">
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="fw-semibold bg-white">
              Incident Trend (Daily)
            </Card.Header>

            <Card.Body style={{ height: 350 }}>
              {timelineData ? (
                <Line data={timelineData} options={chartOptions} />
              ) : (
                <p className="text-muted text-center mt-5">
                  No timeline data available
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default IncidentCharts;
