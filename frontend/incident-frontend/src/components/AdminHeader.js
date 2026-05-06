import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import {
  GridFill,
  Building,
  ShieldLockFill
} from "react-bootstrap-icons";

const AdminHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check active route
  const isActive = (path) => location.pathname.startsWith(path);


  return (
    <Card className="mb-3 mb-md-4 shadow-sm border-0">

      <Card.Body className="p-3 p-md-4">

        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-2 mb-md-3">

          <div className="w-100">
            <h2 className="mb-1 fs-5 fs-md-3 text-break">
              <ShieldLockFill className="me-2 text-primary" />
              Admin Control Panel
            </h2>

            <small className="text-muted d-block">
              Manage incidents, departments and system operations
            </small>
          </div>

          <div className="mt-2 mt-md-0 d-flex flex-wrap gap-2">
            <Badge bg="dark" className="me-2">
              Admin
            </Badge>

            <Badge bg="primary">
            {location.pathname.includes("departments")
              ? "Departments"
              : "Dashboard"}
          </Badge>

          </div>

        </div>

        {/* Navigation Section */}

        <div className="d-flex flex-column flex-sm-row gap-2">

          <Button
            className="w-100 w-sm-auto py-2"
            variant={isActive("/admin") ? "dark" : "outline-dark"}
            onClick={() => navigate("/admin")}
          >
            <GridFill className="me-2" />
            Incidents
          </Button>

          <Button
            className="w-100 w-sm-auto py-2"
            variant={
              isActive("/admin/departments")
                ? "dark"
                : "outline-dark"
            }
            onClick={() => navigate("/admin/departments")}
          >
            <Building className="me-2" />
            Departments
          </Button>

        </div>

      </Card.Body>

    </Card>
  );
};

export default AdminHeader;
