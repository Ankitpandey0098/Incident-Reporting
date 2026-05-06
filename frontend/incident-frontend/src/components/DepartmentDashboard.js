// src/components/DepartmentDashboard.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../api/axios";
import {
  Table,
  Card,
  Spinner,
  Badge,
  Button,
  Alert,
  Row,
  Col
} from "react-bootstrap";

const DepartmentDashboard = () => {

  const token = localStorage.getItem("access");
  const department = localStorage.getItem("department");

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const statusMap = {
    "Pending": "pending",
    "In Progress": "in progress",
    "Resolved": "resolved"
  };

 useEffect(() => {
  fetchIncidents();
}, [fetchIncidents]);


  const fetchIncidents = async () => {

  setLoading(true);

  try {

    const res = await axios.get(
  "https://incident-reporting-rjwi.onrender.com/api/incidents/",
  { headers: { Authorization: `Bearer ${token}` } }
);


    const filtered = res.data.filter(
      (i) =>
        i.department &&
        i.department.toLowerCase().trim() ===
        department.toLowerCase().trim()
    );

    // 👇 FIXED HERE
    const sorted = [...filtered].sort((a, b) => {

      const order = {
        "pending": 1,
        "in progress": 2,
        "resolved": 3
      };

      return (
        order[a.status?.toLowerCase()] -
        order[b.status?.toLowerCase()]
      );
    });

    setIncidents(sorted);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  const updateStatus = async (incident, status) => {

  console.log("Updating Incident:", incident.id);
  console.log("New Status:", status);

  try {

    const res = await axios.patch(
      `https://incident-reporting-rjwi.onrender.com/api/incidents/${incident.id}/`,
      { status: statusMap[status] },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Response:", res.data);

    // ✅ Update UI immediately
    setIncidents(prev =>
      prev.map(item =>
        item.id === incident.id
          ? { ...item, status: status }
          : item
      )
    );

    setMessage(`Status updated to ${status}`);

  } catch (err) {

    console.error("Update Error:", err.response?.data || err.message);
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

  const priorityBadge = (priority) => {

    const p = priority?.toLowerCase();

    if (p === "high")
      return <Badge bg="danger">High</Badge>;

    if (p === "medium")
      return <Badge bg="warning">Medium</Badge>;

    return <Badge bg="secondary">Low</Badge>;
  };

  // Stats Calculation
  const total = incidents.length;

  const pending = incidents.filter(
    (i) => i.status?.toLowerCase() === "pending"
  ).length;

  const inProgress = incidents.filter(
    (i) => i.status?.toLowerCase() === "in progress"
  ).length;

  const resolved = incidents.filter(
    (i) => i.status?.toLowerCase() === "resolved"
  ).length;

  return (

    <div
      style={{
        minHeight: "100vh",
        paddingTop: "15px",
        paddingBottom: "30px",
        paddingLeft: "8px",
        paddingRight: "8px",
        background: "#f8f9fa"
      }}
    >

      <div className="container px-2 px-md-3">

        {/* Header Card */}
        <Card className="mb-4 shadow-sm border-0 rounded-3">
          <Card.Body className="p-2 p-md-3" style={{ overflowX: "auto", overflowY: "auto", maxHeight: "600px" }}>
            <h3 className="mb-1 fw-bold fs-5 fs-md-4 text-break">
              🏛️ {department} Department Dashboard
            </h3>
            <small className="text-muted d-block">
              Manage assigned incidents and update their status
            </small>
          </Card.Body>
        </Card>

        {/* Stats Cards */}
        <Row className="mb-4">

          <Col xs={6} md={3} className="mb-3">
            <Card className="shadow-sm border-0 h-100 rounded-3">
              <Card.Body className="p-2 p-md-3" style={{ overflowX: "auto", overflowY: "auto", maxHeight: "600px" }}>
                <small className="text-muted d-block">
                  Total Incidents
                </small>
                <h3 className="mt-2 fw-bold fs-5 fs-md-4">
                  📋 {total}
                </h3>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={6} md={3} className="mb-3">
            <Card className="shadow-sm border-0 h-100 rounded-3">
              <Card.Body className="p-2 p-md-3" style={{ overflowX: "auto", overflowY: "auto", maxHeight: "600px" }}>
                <small className="text-warning">
                  Pending
                </small>
                <h3 className="mt-2 fw-bold fs-5 fs-md-4">
                  ⏳ {pending}
                </h3>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={6} md={3} className="mb-3">
            <Card className="shadow-sm border-0 h-100 rounded-3">
              <Card.Body className="p-2 p-md-3" style={{ overflowX: "auto", overflowY: "auto", maxHeight: "600px" }}>
                <small className="text-primary">
                  In Progress
                </small>
                <h3 className="mt-2 fw-bold fs-5 fs-md-4">
                  ⚙️ {inProgress}
                </h3>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={6} md={3} className="mb-3">
            <Card className="shadow-sm border-0 h-100 rounded-3">
              <Card.Body className="p-2 p-md-3" style={{ overflowX: "auto", overflowY: "auto", maxHeight: "600px" }}>
                <small className="text-success">
                  Resolved
                </small>
                <h3 className="mt-2 fw-bold fs-5 fs-md-4">
                  ✅ {resolved}
                </h3>
              </Card.Body>
            </Card>
          </Col>

        </Row>

        {message && (
          <Alert
            variant="info"
            dismissible
            onClose={() => setMessage(null)}
          >
            {message}
          </Alert>
        )}

        {/* Incidents Table */}
        <Card className="shadow-sm border-0 rounded-3">

          <Card.Header className="bg-white border-0 py-3">
            <h5 className="mb-0 fw-semibold">
              📌 Assigned Incidents
            </h5>
          </Card.Header>

          <Card.Body className="p-2 p-md-3" style={{ overflowX: "auto", overflowY: "auto", maxHeight: "600px" }}>

            {loading ? (
              <div className="text-center py-4">
                <Spinner animation="border" />
              </div>
            ) : incidents.length === 0 ? (

              <Alert variant="success">
                No incidents assigned 🎉
              </Alert>

            ) : (

              <Table hover responsive className="align-middle small" style={{ minWidth: "900px" }}>

                <thead className="table-light text-nowrap">
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>User</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {incidents.map((inc) => (

                    <tr key={inc.id}>

                      <td>{inc.id}</td>

                      <td className="fw-semibold text-break">
                        {inc.title}
                      </td>

                      <td className="text-break">
                        {inc.description?.substring(0, 40)}...
                      </td>

                      <td>
                        {inc.user?.username}
                      </td>

                      <td>
                        {priorityBadge(inc.priority)}
                      </td>

                      <td>
                        {statusBadge(inc.status)}
                      </td>

                      <td>
                        {new Date(inc.created_at).toLocaleString()}
                      </td>

                      <td>

                        {inc.status?.toLowerCase() !== "resolved" && (

                          <div className="d-flex gap-2 flex-wrap">

                            <Button
                              size="sm"
                              variant="warning"
                              onClick={() =>
                                updateStatus(inc, "In Progress")

                              }
                            >
                              Start
                            </Button>

                            <Button
                              size="sm"
                              variant="success"
                              onClick={() =>
                                updateStatus(inc, "Resolved")

                              }
                            >
                              Resolve
                            </Button>

                          </div>

                        )}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </Table>

            )}

          </Card.Body>

        </Card>

      </div>

    </div>
  );
};

export default DepartmentDashboard;
