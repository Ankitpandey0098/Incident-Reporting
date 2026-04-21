import React, { useState } from "react";
import axios from "axios";
import api from "../api/axios";
import { 
  Form, 
  Button, 
  Container, 
  Alert, 
  Card,
  Row,
  Col
} from "react-bootstrap";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ReportIncident() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [attachment, setAttachment] = useState(null);
  const [attachmentName, setAttachmentName] = useState("");
  


  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [showMap, setShowMap] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [severity, setSeverity] = useState("medium");
  const [preview, setPreview] = useState(null);


  // 📡 Get GPS location
  const getCurrentLocation = () => {

    if (!navigator.geolocation) {
      setError("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(

      (position) => {

        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);

      },

      () => {
        setError("Unable to retrieve location.");
      }

    );
  };

  // 📍 Map click handler
  function LocationMarker() {

    useMapEvents({
      click(e) {
        setLatitude(e.latlng.lat);
        setLongitude(e.latlng.lng);
      },
    });

    return latitude && longitude ? (
      <Marker position={[latitude, longitude]} />
    ) : null;
  }

  const handleSubmit = async (e) => {

    e.preventDefault();
    setError("");
    setMessage("");

    const token = localStorage.getItem("access");

    if (!token) {
      setError("Please login first");
      return;
    }

    try {

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);

      if (latitude && longitude) {
        formData.append("latitude", latitude);
        formData.append("longitude", longitude);
      }

      if (attachment) {
        formData.append("attachment", attachment);
      }

      await axios.post(
  "https://incident-reporting-rjwi.onrender.com/api/incidents/",
  formData,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);


      setMessage("✅ Report submitted successfully.");

      setTitle("");
      setDescription("");
      setAttachment(null);
      setAttachmentName("");
      setLatitude(null);
      setLongitude(null);
      setPreview(null);

    } catch (err) {

      console.error(err.response?.data || err.message);
      setError("❌ Failed to report the incident.");

    }
  };

  return (
  <div
    style={{
      minHeight: "100vh",
      background: "#f4f7fb",
      padding: "40px 20px"
    }}
  >

    <Container style={{ maxWidth: "900px" }}>

      {/* HEADER */}
      <div className="mb-4">
        <h3 style={{ fontWeight: "800" }}>
          🏙️ Report an Incident
        </h3>
        <p className="text-muted">
          Report civic, infrastructure, or environmental issues in your city
        </p>
      </div>

      <Card
        className="shadow-sm"
        style={{
          borderRadius: "16px",
          border: "none"
        }}
      >

        <Card.Body className="p-4">

          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}

          <Form onSubmit={handleSubmit}>

            <Row>

              {/* LEFT COLUMN */}
              <Col md={6}>

                {/* Title */}
                <Form.Group className="mb-3">
                  <Form.Label>Incident Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Short summary"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={{ borderRadius: "10px" }}
                  />
                </Form.Group>

                {/* Description */}
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    placeholder="Describe the issue..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    style={{ borderRadius: "10px" }}
                  />
                </Form.Group>

                {/* File Upload */}
                <Form.Group className="mb-3">
                  <Form.Label>Attachment</Form.Label>

                  <Form.Control
                    type="file"
                    onChange={(e) => {
                      if (e.target.files.length > 0) {
                        const file = e.target.files[0];

                        setAttachment(file);
                        setAttachmentName(file.name);

                        // preview image
                        setPreview(URL.createObjectURL(file));

                      }
                    }}
                  />
          {preview && (
  <img
    src={preview}
    alt="preview"
    style={{
      width: "100%",
      maxHeight: "200px",
      objectFit: "cover",
      marginTop: "10px",
      borderRadius: "10px"
    }}
  />
)}

                  {attachmentName && (
                    <div className="mt-2 text-muted small">
                      📎 {attachmentName}
                    </div>
                  )}
                </Form.Group>

              </Col>

              {/* RIGHT COLUMN */}
              <Col md={6}>

                <Card
                  className="mb-3"
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #eee",
                    borderRadius: "12px"
                  }}
                >

                  <Card.Body>

                    <h6 className="mb-3">
                      📍 Location Selection
                    </h6>

                    <div className="d-flex gap-2 mb-3">

                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={getCurrentLocation}
                      >
                        📡 GPS
                      </Button>

                      <Button
                        size="sm"
                        variant="outline-success"
                        onClick={() => setShowMap(!showMap)}
                      >
                        🗺 Map
                      </Button>

                    </div>

                    {/* Map */}
                    {showMap && (
                      <MapContainer
                        center={[28.4744, 77.5040]}
                        zoom={13}
                        style={{
                          height: "220px",
                          width: "100%",
                          borderRadius: "10px"
                        }}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <LocationMarker />

                      </MapContainer>
                    )}

                    {/* Coordinates */}
                    {latitude && longitude && (
                      <div className="mt-3 p-2 bg-white rounded border">

                        <small className="text-muted">
                          Selected Location
                        </small>

                        <div style={{ fontSize: "13px" }}>
                          {latitude.toFixed(5)} , {longitude.toFixed(5)}
                        </div>

                        <Button
                          size="sm"
                          variant="outline-secondary"
                          className="mt-2"
                          onClick={() =>
                            window.open(
                              `https://www.google.com/maps?q=${latitude},${longitude}`,
                              "_blank"
                            )
                          }
                        >
                          View Map
                        </Button>

                      </div>
                    )}

                  </Card.Body>

                </Card>

              </Col>

            </Row>

            {/* SUBMIT */}
            <Button
              type="submit"
              size="lg"
              className="w-100 mt-3"
              style={{
                borderRadius: "10px",
                fontWeight: "600"
              }}
            >
              Submit Report
            </Button>

          </Form>

        </Card.Body>

      </Card>

    </Container>

  </div>
);

}

export default ReportIncident;
