import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

const HeatmapLayer = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;

    const heatPoints = points.map((p) => [p.lat, p.lng, 1]);

    const heat = L.heatLayer(heatPoints, {
      radius: 25,
      blur: 15,
      maxZoom: 10,
    });

    heat.addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [points, map]);

  return null;
};

const IncidentHeatmap = () => {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    const fetchHeatmap = async () => {
      const token = localStorage.getItem("access");

      const res = await axios.get(
        "http://127.0.0.1:8000/api/analytics/heatmap/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPoints(res.data);
    };

    fetchHeatmap();
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        background: "#f5f7fb",
        minHeight: "100vh",
      }}
    >

      {/* HEADER */}
      <div style={{ marginBottom: "15px" }}>
        <h4 style={{ fontWeight: "700", marginBottom: "5px" }}>
          Incident Heatmap
        </h4>
        <p style={{ margin: 0, color: "#6c757d", fontSize: "0.95rem" }}>
          Geographic distribution of reported incidents
        </p>
      </div>

      {/* MAP CARD */}
      <div
        style={{
          background: "#fff",
          borderRadius: "14px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >

        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          style={{
            height: "600px",
            width: "100%",
          }}
        >
          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <HeatmapLayer points={points} />
        </MapContainer>

      </div>

    </div>
  );
};

export default IncidentHeatmap;
