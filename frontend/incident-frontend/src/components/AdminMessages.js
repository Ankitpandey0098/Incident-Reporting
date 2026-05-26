import React, { useEffect, useState } from "react";

import {
  Card,
  Spinner,
  Alert,
  Table,
  Badge,
  Button,
  Modal
} from "react-bootstrap";

import AdminHeader from "./AdminHeader";
import api from "../api/axios";

const AdminMessages = () => {

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchMessages = async () => {

    setLoading(true);

    try {

      const res = await api.get("/contact-list/");

      setMessages(res.data);

    } catch (err) {

      console.error(err);
      setError("Failed to load messages");

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const openMessage = (msg) => {
    setSelectedMessage(msg);
    setShowModal(true);
  };

  return (
    <div className="container-fluid mt-3 mt-md-4 px-2 px-md-3">

      <AdminHeader />

      {error && (
        <Alert
          variant="danger"
          onClose={() => setError("")}
          dismissible
        >
          {error}
        </Alert>
      )}

      <Card className="shadow-sm border-0">

        <Card.Header className="bg-white">
          <h5 className="mb-0">
            📩 Contact Messages
          </h5>
        </Card.Header>

        <Card.Body>

          {loading ? (

            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>

          ) : (

            <Table hover responsive className="align-middle">

              <thead className="table-light">

                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {messages.length === 0 ? (

                  <tr>
                    <td colSpan="6" className="text-center">
                      No messages found
                    </td>
                  </tr>

                ) : (

                  messages.map((msg) => (

                    <tr key={msg.id}>

                      <td>{msg.id}</td>

                      <td>{msg.name}</td>

                      <td>
                        <Badge bg="dark">
                          {msg.email}
                        </Badge>
                      </td>

                      <td>{msg.subject}</td>

                      <td>
                        {new Date(msg.created_at).toLocaleString()}
                      </td>

                      <td>

                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => openMessage(msg)}
                        >
                          View
                        </Button>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </Table>

          )}

        </Card.Body>

      </Card>

      {/* MESSAGE MODAL */}

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
      >

        <Modal.Header closeButton>
          <Modal.Title>
            Contact Message
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>

          {selectedMessage && (

            <>

              <p>
                <strong>Name:</strong>{" "}
                {selectedMessage.name}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {selectedMessage.email}
              </p>

              <p>
                <strong>Subject:</strong>{" "}
                {selectedMessage.subject}
              </p>

              <hr />

              <p style={{ whiteSpace: "pre-wrap" }}>
                {selectedMessage.message}
              </p>

            </>

          )}

        </Modal.Body>

      </Modal>

    </div>
  );
};

export default AdminMessages;