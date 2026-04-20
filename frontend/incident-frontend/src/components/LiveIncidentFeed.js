import React, { useEffect, useState } from "react";
import axios from "axios";
import { Badge } from "react-bootstrap";
import api from "../api/axios";
const LiveIncidentFeed = () => {
  const [incidents, setIncidents] = useState([]);

  const token = localStorage.getItem("access");

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchIncidents = async () => {
    try {
      const res = await axios.get(
  "https://incident-reporting-rjwi.onrender.com/api/incidents/",
  axiosConfig
);

      const data = Array.isArray(res.data) ? res.data : [];

      const sorted = data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setIncidents(sorted.slice(0, 10));
    } catch (err) {
      console.error("Incident fetch error", err);
    }
  };

  useEffect(() => {
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 10000);
    return () => clearInterval(interval);
  }, []);

  const getIcon = (category) => {
    const cat = (category || "").toLowerCase();

    if (cat.includes("fire")) return "🔥";
    if (cat.includes("accident")) return "🚧";
    if (cat.includes("crime")) return "🚔";
    if (cat.includes("medical")) return "🚑";

    return "📍";
  };

  const getStatusColor = (status) => {
    const s = (status || "").toLowerCase();

    if (s === "pending") return "#dc3545";
    if (s === "in progress") return "#fd7e14";
    if (s === "resolved") return "#198754";

    return "#6c757d";
  };

  const getStatusVariant = (status) => {
    const s = (status || "").toLowerCase();

    if (s === "pending") return "danger";
    if (s === "in progress") return "warning";
    if (s === "resolved") return "success";

    return "secondary";
  };

  return (
    <div
      style={{
        width: "340px",
        background: "#ffffff",
        borderRadius: "14px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        border: "1px solid #f1f1f1",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 16px",
          borderBottom: "1px solid #eee",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#f8f9fa",
        }}
      >
        <h5 style={{ margin: 0, fontWeight: "600" }}>
          🚨 Live Incident Feed
        </h5>

        <Badge bg="dark" pill>
          LIVE
        </Badge>
      </div>

      {/* Body */}
      <div
        style={{
          maxHeight: "500px",
          overflowY: "auto",
          padding: "10px",
        }}
      >
        {incidents.length === 0 && (
          <p style={{ textAlign: "center", color: "#888", marginTop: "20px" }}>
            No incidents found
          </p>
        )}

        {incidents.map((incident) => (
          <div
            key={incident.id}
            style={{
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "10px",
              background: "#fff",
              border: "1px solid #f0f0f0",
              transition: "0.2s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-2px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0px)")
            }
          >
            {/* Title */}
            <div
              style={{
                fontWeight: "600",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>{getIcon(incident.category)}</span>
              {incident.title}
            </div>

            {/* Category */}
            <div
              style={{
                fontSize: "12px",
                color: "#666",
                marginTop: "4px",
              }}
            >
              Category: {incident.category || "General"}
            </div>

            {/* Status */}
            <div style={{ marginTop: "6px" }}>
              <Badge bg={getStatusVariant(incident.status)} pill>
                {incident.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveIncidentFeed;
