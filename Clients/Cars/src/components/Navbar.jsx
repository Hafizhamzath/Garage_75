import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useEffect, useState } from "react";

function Navigation() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // Sync login state when localStorage changes (cross-tab or same-tab)
  useEffect(() => {
    const syncLoginState = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    // Listen for cross-tab storage changes
    window.addEventListener("storage", syncLoginState);
    // Listen for same-tab localStorage changes via custom event
    window.addEventListener("localStorageChange", syncLoginState);

    return () => {
      window.removeEventListener("storage", syncLoginState);
      window.removeEventListener("localStorageChange", syncLoginState);
    };
  }, []);

  // Handle logout action
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("localStorageChange"));
    navigate("/", { replace: true }); // Redirect to homepage
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src="https://res.cloudinary.com/dc54r1zx9/image/upload/v1739987077/g0plgyozf5rrar2hbxmn.jpg"
            alt="Logo"
            width="40"
            height="40"
            className="d-inline-block align-top me-2"
          />
          GARAGE_CUSTOMS
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/products">Cars</Nav.Link>
            <Nav.Link as={Link} to="/cart">Cart</Nav.Link>
            {isLoggedIn ? (
              <Nav.Link onClick={handleLogout} style={{ cursor: "pointer" }}>
                Logout
              </Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;