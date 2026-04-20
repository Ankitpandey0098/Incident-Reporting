// src/components/AdminDashboard.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Card,
  Spinner,
  Row,
  Col,
  Badge,
  Button,
  Alert,
  InputGroup,
  Form
} from "react-bootstrap";
import { EnvelopeFill, GeoAltFill, Search } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./AdminHeader";

const AdminDashboard = () => {

  const token = localStorage.getItem("access");
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [visibleIncidents, setVisibleIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    progress: 0,
    resolved: 0
  });

  const [categoryStats, setCategoryStats] = useState([]);

  useEffect(() => {
    fetchIncidents();
  }, []);

  useEffect(() => {

    let filtered = incidents;

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((inc) =>
        inc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "") {
      filtered = filtered.filter(
        (inc) => inc.status?.toLowerCase() === statusFilter
      );
    }

    if (showAll) {
      setVisibleIncidents(filtered);
    } else {
      setVisibleIncidents(filtered.slice(0, 10));
    }

  }, [incidents, showAll, searchTerm, statusFilter]);

  // (ALL YOUR LOGIC FUNCTIONS REMAIN EXACTLY SAME — NO CHANGES)

  // ... keeping your logic unchanged ...

  const fetchIncidents = async () => {

    setLoading(true);

    try {

      const res = await axios.get(
        "http://127.0.0.1:8000/api/incidents/",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const sorted = sortIncidents(res.data);

      setIncidents(sorted);

      calculateStats(sorted);
      calculateCategoryStats(sorted);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sortIncidents = (data) => {

    const order = {
      "in progress": 1,
      "pending": 2,
      "resolved": 3
    };

    return [...data].sort((a, b) => {

      const statusA = a.status?.toLowerCase();
      const statusB = b.status?.toLowerCase();

      return (order[statusA] || 99) - (order[statusB] || 99);
    });
  };

  const calculateStats = (data) => {

    let pending = 0;
    let progress = 0;
    let resolved = 0;

    data.forEach((inc) => {

      const status = inc.status?.toLowerCase();

      if (status === "pending") pending++;
      if (status === "in progress") progress++;
      if (status === "resolved") resolved++;

    });

    setStats({
      total: data.length,
      pending,
      progress,
      resolved
    });
  };

  const calculateCategoryStats = (data) => {

    const map = {};

    data.forEach((inc) => {

      if (!inc.category) return;

      map[inc.category] = (map[inc.category] || 0) + 1;

    });

    const result = Object.keys(map).map((key) => ({
      category: key,
      count: map[key]
    }));

    setCategoryStats(result);
  };

  const reportIncident = async (incident) => {

    try {

      const res = await axios.post(
        `http://127.0.0.1:8000/api/incidents/${incident.id}/report/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(
        `Email sent to ${incident.department} (Total: ${res.data.email_count})`
      );

      const updated = incidents.map((i) =>
        i.id === incident.id
          ? {
              ...i,
              email_sent_count: res.data.email_count,
              reported_to_department: true
            }
          : i
      );

      setIncidents(updated);

    } catch (err) {

      setMessage(
        err.response?.data?.error || "Failed to send email"
      );
    }
  };

  const updateStatus = async (incident, newStatus) => {

    try {

      await axios.patch(
        `http://127.0.0.1:8000/api/incidents/${incident.id}/`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(`Status updated to ${newStatus}`);

      const updated = incidents.map((i) =>
        i.id === incident.id ? { ...i, status: newStatus } : i
      );

      const sorted = sortIncidents(updated);

      setIncidents(sorted);
      calculateStats(sorted);

    } catch (err) {

      console.error(err);
      setMessage("Failed to update status");

    }
  };

  const statusBadge = (status) => {

    const s = status?.toLowerCase();

    if (s === "pending")
      return <Badge bg="warning">Pending</Badge>;

    if (s === "in progress")
      return <Badge bg="primary">In Progress</Badge>;

    return <Badge bg="success">Resolved</Badge>;
  };

  return (

    <div className="container-fluid mt-4">

      <AdminHeader />

      {/* Search Bar */}

      <Card className="shadow-sm border-0 mb-3">
        <Card.Body>

          <InputGroup>
            <InputGroup.Text>
              <Search />
            </InputGroup.Text>

            <Form.Control
              placeholder="Search by title, category, department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

          </InputGroup>

        </Card.Body>
      </Card>

      {/* Filter Buttons */}

      <Card className="shadow-sm border-0 mb-4">
        <Card.Body className="d-flex gap-2 flex-wrap">

          <Button
            size="sm"
            variant={statusFilter === "" ? "dark" : "outline-dark"}
            onClick={() => setStatusFilter("")}
          >
            All
          </Button>

          <Button
            size="sm"
            variant={statusFilter === "pending" ? "warning" : "outline-warning"}
            onClick={() => setStatusFilter("pending")}
          >
            Pending
          </Button>

          <Button
            size="sm"
            variant={statusFilter === "in progress" ? "info" : "outline-info"}
            onClick={() => setStatusFilter("in progress")}
          >
            In Progress
          </Button>

          <Button
            size="sm"
            variant={statusFilter === "resolved" ? "success" : "outline-success"}
            onClick={() => setStatusFilter("resolved")}
          >
            Resolved
          </Button>

        </Card.Body>
      </Card>

      {message && (
        <Alert
          variant="info"
          dismissible
          onClose={() => setMessage(null)}
        >
          {message}
        </Alert>
      )}

      {/* Stats Cards */}

      <Row className="mb-4">

        <Col md={3}>
          <Card className="shadow-sm border-0 text-center">
            <Card.Body>
              <small>Total Incidents</small>
              <h3>📋 {stats.total}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="shadow-sm border-0 text-center">
            <Card.Body>
              <small className="text-warning">Pending</small>
              <h3>⏳ {stats.pending}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="shadow-sm border-0 text-center">
            <Card.Body>
              <small className="text-primary">In Progress</small>
              <h3>⚙️ {stats.progress}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="shadow-sm border-0 text-center">
            <Card.Body>
              <small className="text-success">Resolved</small>
              <h3>✅ {stats.resolved}</h3>
            </Card.Body>
          </Card>
        </Col>

      </Row>

      {/* Category Stats */}

      <Card className="shadow-sm border-0 mb-4">

        <Card.Header className="bg-white">
          <h5 className="mb-0">📊 Incident Categories</h5>
        </Card.Header>

        <Card.Body>

          {categoryStats.length === 0
            ? "No data available"
            : categoryStats.map((cat) => (
                <div
                  key={cat.category}
                  className="d-flex justify-content-between mb-2"
                >
                  <span>{cat.category}</span>
                  <Badge bg="secondary">{cat.count}</Badge>
                </div>
              ))}

        </Card.Body>

      </Card>

      {/* Incidents Table */}

      <Card className="shadow-sm border-0">

        <Card.Header className="bg-white">
          <h5 className="mb-0">📌 All Incidents</h5>
        </Card.Header>

        <Card.Body style={{ maxHeight: "600px", overflow: "auto" }}>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : (

            <>
              <Table hover responsive className="align-middle">

                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>User</th>
                    <th>Category</th>
                    <th>Department</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Location</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {visibleIncidents.map((inc) => (

                    <tr key={inc.id}>

                      <td>{inc.id}</td>
                      <td className="fw-semibold">{inc.title}</td>
                      <td>{inc.user?.username || "N/A"}</td>
                      <td>{inc.category}</td>
                      <td>{inc.department}</td>

                      <td>
                        <Badge bg="secondary">
                          {inc.email_sent_count || 0}
                        </Badge>
                      </td>

                      <td>{statusBadge(inc.status)}</td>

                      <td>

                        {inc.latitude && inc.longitude ? (
                          <Button
                            size="sm"
                            variant="outline-success"
                            href={`https://www.google.com/maps?q=${inc.latitude},${inc.longitude}`}
                            target="_blank"
                          >
                            <GeoAltFill />
                          </Button>
                        ) : "N/A"}

                      </td>

                      <td>

                        <div className="d-flex gap-1 flex-wrap">

                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => reportIncident(inc)}
                          >
                            <EnvelopeFill />
                          </Button>

                          <Button
                            size="sm"
                            variant="outline-warning"
                            onClick={() => updateStatus(inc, "pending")}
                          >
                            P
                          </Button>

                          <Button
                            size="sm"
                            variant="outline-info"
                            onClick={() => updateStatus(inc, "in progress")}
                          >
                            IP
                          </Button>

                          <Button
                            size="sm"
                            variant="outline-success"
                            onClick={() => updateStatus(inc, "resolved")}
                          >
                            R
                          </Button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </Table>

              {incidents.length > 10 && (

                <div className="text-center mt-3">
                  <Button
                    variant="outline-dark"
                    onClick={() => setShowAll(!showAll)}
                  >
                    {showAll ? "Show Less" : "Show More"}
                  </Button>
                </div>

              )}

            </>

          )}

        </Card.Body>

      </Card>

    </div>
  );
};

export default AdminDashboard;
