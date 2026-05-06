// src/components/Footer.js
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      style={{
        background: "linear-gradient(135deg,#020617,#020617,#0f172a)",
        color: "#e5e7eb",
      }}
      className="pt-4 pt-md-5 pb-4 mt-4 mt-md-5"
    >
      <Container>

        <Row className="gy-4 text-center text-md-start">

          {/* ===== BRAND ===== */}

          <Col md={4}>

            <h5
              className="fw-bold text-white mb-3"
              style={{ letterSpacing: "0.5px" }}
            >
              🚨 Incident Platform
            </h5>

            <p
              style={{
                color: "#cbd5f5",
                fontSize: "0.92rem",
                lineHeight: 1.8
              }}
            >
              A centralized smart platform for reporting, tracking, and resolving
              incidents in real-time. Designed to improve response efficiency,
              transparency, and smart city operations.
            </p>

            {/* Social Icons */}

            <div className="d-flex gap-3 mt-3 justify-content-center justify-content-md-start">

              <a href="#" onClick={(e) => e.preventDefault()} className="social-icon">
                <i className="bi bi-facebook"></i>
              </a>

              <a href="#" className="social-icon">
                <i className="bi bi-twitter"></i>
              </a>

              <a href="https://www.linkedin.com/in/ankit-pandey-0b38b1328/" target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="bi bi-linkedin"></i>
              </a>

              <a href="https://github.com/Ankitpandey0098" target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="bi bi-github"></i>
              </a>

            </div>

          </Col>


          {/* ===== QUICK LINKS ===== */}

          <Col xs={12} md={4}>

            <h6 className="fw-semibold text-white mb-3">
              Quick Links
            </h6>

            <ul className="list-unstyled footer-links">

              <li>
                <Link to="/">Home</Link>
              </li>

              <li>
                <Link to="/about">About Us</Link>
              </li>

              <li>
                <Link to="/contact">Contact
                </Link>
              </li>

            </ul>

          </Col>


          {/* ===== CONTACT ===== */}

          <Col md={4}>

            <h6 className="fw-semibold text-white mb-3">
              Contact
            </h6>

            <div className="footer-contact text-center text-md-start">

              <p>
                📧 support@incidentplatform.com
              </p>

              <p>
                📞 +91 8630435665
              </p>

              <p>
                📍 Delhi NCR, India
              </p>

            </div>

          </Col>

        </Row>


        {/* Divider */}

        <hr
          style={{
            borderColor: "#1e293b",
            margin: "2rem 0",
          }}
        />


        {/* Bottom Footer */}

        <Row className="align-items-center">

          <Col md={6}>
            <p
              className="mb-0"
              style={{
                fontSize: "0.85rem",
                color: "#94a3b8"
              }}
            >
              © {new Date().getFullYear()} Incident Platform.
              All rights reserved.
            </p>
          </Col>

          <Col
            md={6}
            className="text-md-end mt-2 mt-md-0"
          >
            <small className="footer-policy">
              Privacy Policy • Terms • Security
            </small>
          </Col>

        </Row>

      </Container>


      {/* ===== Styles ===== */}

      <style>{`

        footer {
          border-top: 1px solid #1e293b;
        }

        .footer-links li {
          margin-bottom: 12px;
        }

        .footer-links a {
          color: #cbd5f5;
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .footer-links a:hover {
          color: #60a5fa;
          padding-left: 6px;
        }

        .footer-contact p {
          font-size: 0.9rem;
          margin-bottom: 10px;
          color: #cbd5f5;
        }

        .footer-policy {
          color: #94a3b8;
          font-size: 0.85rem;
        }

        .social-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: #020617;
          color: #cbd5f5;
          font-size: 16px;
          transition: all 0.25s ease;
          border: 1px solid #1e293b;
        }

        .social-icon:hover {
          color: white;
          background: #2563eb;
          transform: translateY(-3px);
          box-shadow: 0 6px 15px rgba(37,99,235,0.3);
        }

      `}</style>

    </footer>
  );
};

export default Footer;
