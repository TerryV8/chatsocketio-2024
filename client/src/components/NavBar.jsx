import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Notification from "./chat/Notification";

const NavBar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  return (
    <Navbar
      bg="dark"
      className="mb-4"
      style={{ height: "3.75rem", color: "red" }}
    >
      <Container>
        <h2>
          <Link to="/" className="link-light text-decoration-none">
            ChatApp
          </Link>
        </h2>
        {user && (
          <span className="text-warning">Logged in as {user?.name}</span>
        )}

        <Nav>
          <Stack direction="horizontal" gap={1}>
            {user && (
              <>
                <Notification />
                <Link
                  onClick={() => {
                    logoutUser();
                  }}
                  to="/login"
                  className="btn btn-outline-light me-2"
                >
                  Logout
                </Link>
              </>
            )}
            {!user && (
              <>
                <Link to="/login" className="btn btn-outline-light me-2">
                  Login
                </Link>
                <Link to="/register" className="btn btn-outline-light me-2">
                  Register
                </Link>
              </>
            )}
          </Stack>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
