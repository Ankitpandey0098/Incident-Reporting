import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  Form,
  Button,
  Alert,
  Card,
  Spinner,
  Container,
  Row,
  Col
} from "react-bootstrap";

const EditIncident = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 🔹 Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  // 🔹 UI states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // 📥 Fetch incident
  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const token = localStorage.getItem("access");

        axios.post(
  "https://incident-reporting-rjwi.onrender.com/api/departments/add/",
  addForm,
  { headers: { Authorization: `Bearer ${token}` } }
);


        setTitle(res.data.title);
        setDescription(res.data.description);
        setLatitude(res.data.latitude || "");
        setLongitude(res.data.longitude || "");
        setExistingImage(res.data.attachment);

      } catch (err) {
        console.error(err);
        setError("❌ Failed to load incident.");
      } finally {
        setLoading(false);
      }
    };

    fetchIncident();
  }, [id]);

  // 📍 Get current GPS location
  const getCurrentLocation = () => {

    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {

      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);

    });
  };

  // 💾 Update incident
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    if (!title.trim() || !description.trim()) {
      setError("Title and description cannot be empty.");
      setSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem("access");

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);

      if (attachment) {
        formData.append("attachment", attachment);
      }

      await axios.patch(
  `https://incident-reporting-rjwi.onrender.com/api/incidents/${id}/`,
  formData,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);


      alert("✅ Incident updated successfully!");
      navigate("/", { replace: true });

    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("❌ Failed to update incident.");
    } finally {
      setSaving(false);
    }
  };

  // ⏳ Loading
  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#f8f9fa",
        paddingTop: "20px",
        paddingBottom: "40px"
      }}
    >

      <Container>

        <Row className="justify-content-center">

          <Col md={8} lg={7}>

            <Card className="shadow-sm border-0 rounded-3">

              <Card.Body className="p-4">

                <div className="mb-3">
                  <h3 className="fw-bold mb-1">
                    ✏️ Edit Incident
                  </h3>
                  <small className="text-muted">
                    Update incident information and location
                  </small>
                </div>

                {error && (
                  <Alert variant="danger">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleUpdate}>

                  {/* Title */}
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </Form.Group>

                  {/* Description */}
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </Form.Group>

                  {/* Location Card */}
                  <Card className="mb-3 border-0 bg-light">
                    <Card.Body>

                      <h5 className="mb-3">
                        📍 Location
                      </h5>

                      <Row>

                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Latitude</Form.Label>
                            <Form.Control
                              type="number"
                              step="any"
                              value={latitude}
                              onChange={(e) =>
                                setLatitude(e.target.value)
                              }
                            />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Longitude</Form.Label>
                            <Form.Control
                              type="number"
                              step="any"
                              value={longitude}
                              onChange={(e) =>
                                setLongitude(e.target.value)
                              }
                            />
                          </Form.Group>
                        </Col>

                      </Row>

                      <div className="d-flex gap-2 flex-wrap">

                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={getCurrentLocation}
                        >
                          📡 Use My Location
                        </Button>

                        {latitude && longitude && (
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() =>
                              window.open(
                                `https://www.google.com/maps?q=${latitude},${longitude}`,
                                "_blank"
                              )
                            }
                          >
                            🗺️ View Map
                          </Button>
                        )}

                      </div>

                    </Card.Body>
                  </Card>


                  {/* Existing Image */}
                  {existingImage && (
                    <Card className="mb-3 border-0">
                      <Card.Body>

                        <Form.Label>
                          Current Attachment
                        </Form.Label>

                        <div className="mt-2">

                          <img
                            src={
                                existingImage.startsWith("http")
                                  ? existingImage
                                  : `https://incident-reporting-rjwi.onrender.com${existingImage}`
                              }

                            alt="Current"
                            style={{
                              maxWidth: "100%",
                              maxHeight: "220px",
                              borderRadius: "8px"
                            }}
                          />

                        </div>

                      </Card.Body>
                    </Card>
                  )}

                  {/* Upload new image */}
                  <Form.Group className="mb-4">
                    <Form.Label>
                      Replace Attachment (optional)
                    </Form.Label>

                    <Form.Control
                      type="file"
                      onChange={(e) =>
                        setAttachment(e.target.files[0])
                      }
                    />
                  </Form.Group>

                  {/* Buttons */}

                  <div className="d-flex gap-2">

                    <Button
                      type="submit"
                      variant="primary"
                      disabled={saving}
                    >
                      {saving ? "Updating..." : "Save Changes"}
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={() => navigate("/")}
                    >
                      Cancel
                    </Button>

                  </div>

                </Form>

              </Card.Body>

            </Card>

          </Col>

        </Row>

      </Container>

    </div>
  );
};

export default EditIncident;
