import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Container, Dropdown, Nav, Navbar } from "react-bootstrap";
import { BASE_URL } from "../constants/setting";
import NodeLogo from "../assets/images/nodejs.ico";
import "./Header.css";
import { useAcountStore } from "../stores/auth";

const Header = () => {
  const { user, logout } = useAcountStore();
  const { pathname = "/" } = useLocation();
  const navigate = useNavigate();

  // State để lưu thông tin avatar và nickname
  const [avatar, setAvatar] = useState(null);
  const [nickname, setNickname] = useState(null);

  // Hàm logout
  const handleLogout = () => {
    logout();
    if (pathname !== "/") {
      navigate("/"); // Điều hướng về trang chủ khi đăng xuất
    }
  };

  useEffect(() => {
    // Kiểm tra nếu có user và username
    if (user?.username) {
      const fetchUserProfile = async () => {
        try {
          // Fetch API để lấy thông tin người dùng
          const response = await fetch(
            `${BASE_URL}/api/profiles/${user.username}`,
            {
              method: "GET",
              headers: {
                accept: "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            const profile = data.profile;
            setAvatar(profile.image); // Lưu avatar vào state
            setNickname(profile.username); // Lưu username vào state
          } else {
            console.error("Error fetching user profile");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };

      fetchUserProfile(); // Gọi API khi có user.username
    }
  }, [user?.username]); // Chạy lại khi `user.username` thay đổi

  return (
    <Navbar expand="lg" className="header">
      {/* bg="dark" data-bs-theme="dark" */}
      <Container>
        <Navbar.Brand href="/">
          <img
            alt="Logo"
            title="Vite.js"
            src={NodeLogo}
            className="d-inline-block"
            width="30"
            height="30"
          />
          CONDUIT
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              href="/"
              className={pathname === "/" ? "active me-1" : "me-1"}
            >
              Homepage
            </Nav.Link>
            <Nav.Link
              href="/tags"
              className={pathname === "/tags" ? "active me-1" : "me-1"}
            >
              Tags
            </Nav.Link>
            {user.username ? (
              <>
                <Nav.Link
                  href={`/profile/${user.username}`}
                  className={
                    pathname.indexOf("/profile/") === 0 ? "active me-1" : "me-1"
                  }
                >
                  Profile
                </Nav.Link>
                <Nav.Link
                  href="/settings"
                  className={pathname === "/settings" ? "active" : ""}
                >
                  Settings
                </Nav.Link>
              </>
            ) : null}
          </Nav>
          <Nav className="d-flex login">
            {user.username ? (
              <Dropdown as={Nav.Item} align="end">
                <Dropdown.Toggle as={Nav.Link} className="px-0">
                  <img
                    alt="Avatar"
                    title={nickname || user.username} // Sử dụng nickname hoặc username
                    src={avatar} // Sử dụng avatarUrl đã được xử lý
                    className="avatar"
                    width="24"
                    height="24"
                  />
                  {nickname || user.username}{" "}
                  {/* Hiển thị nickname hoặc username */}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href={`/profile/${user.username}`}>
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Item href="/settings">Settings</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item href="/topic/initiate">
                    New Topic
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    as="button"
                    className="logout"
                    onClick={handleLogout}
                  >
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Button href="/login" variant="outline-dark">
                  Sign in
                </Button>
                <Button href="/register" variant="dark">
                  Sign up
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
