import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, FloatingLabel, Form, Spinner } from "react-bootstrap";
import Header from "../components/Header";
import ToastComp from "../components/ToastComp";
import Logo from "../assets/images/nodejs.ico";
import axios from "../utils/axios";
import { useAcountStore, useLoadingStore } from "../stores/auth";
import { loadingDelay } from "../utils/loading";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAcountStore();
  const { loading = false, setLoading } = useLoadingStore();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleChange = (type, val) => {
    switch (type) {
      case "email":
        setEmail(val);
        break;
      case "username":
        setUsername(val);
        break;
      case "password":
        setPassword(val);
        break;
      case "passwordConfirm":
        setPasswordConfirm(val);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Kiểm tra tính hợp lệ của form trước khi gửi
    if (!e.currentTarget.checkValidity()) {
      return;
    }

    try {
      // Gửi yêu cầu POST đến API với dữ liệu người dùng
      const { data = {} } = await axios.post(
        "https://node-express-conduit.appspot.com/api/users",
        {
          user: {
            username: username, // Tên người dùng
            email: email, // Email người dùng
            password: password, // Mật khẩu người dùng
          },
        },
        {
          headers: {
            "Content-Type": "application/json", // Đảm bảo gửi dữ liệu dưới dạng JSON
          },
        }
      );

      console.log("API Response Data:", data); // Xem cấu trúc của dữ liệu trả về

      // Kiểm tra xem dữ liệu có chứa trường 'user' không
      const user = data.user;
      const token = user?.token;

      if (!user) {
        throw new Error("User object is missing in the API response.");
      }

      if (!token) {
        throw new Error("Token is missing in the user object.");
      }

      // Đăng nhập người dùng
      login(user, token);

      // Delay để loading
      await loadingDelay(400);
      setLoading(false);

      // Điều hướng sau khi đăng ký thành công
      navigate("/");
    } catch (err) {
      await loadingDelay(300);
      setLoading(false);

      // Hiển thị thông báo lỗi khi gặp sự cố
      setToastMsg(
        err.response?.data?.msg || err.message || "Registration failed"
      );
      setShowToast(true);
    }
  };

  return (
    <>
      <Header />
      <main className="mx-auto p-3">
        <Form
          className="text-center d-flex justify-content-center align-items-center"
          noValidate
          onSubmit={handleSubmit}
        >
          <div style={{ width: "100%", maxWidth: "350px" }}>
            <img
              className="mb-5 mx-auto d-block"
              src={Logo}
              alt="Logo"
              title="Node.js"
              height="57"
            />

            <FloatingLabel controlId="email" label="Email address">
              <Form.Control
                autoComplete="off"
                className="w-100"
                isInvalid={
                  !email.match(
                    /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
                  )
                }
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="username@example.com"
                type="email"
                value={email}
              />
            </FloatingLabel>

            <FloatingLabel controlId="username" label="Username">
              <Form.Control
                autoComplete="off"
                isInvalid={!username}
                onChange={(e) => handleChange("username", e.target.value)}
                placeholder="Username"
                required
                type="text"
                value={username}
              />
            </FloatingLabel>

            <FloatingLabel controlId="password" label="Password">
              <Form.Control
                autoComplete="off"
                isInvalid={!password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Password"
                required
                type="password"
                value={password}
              />
            </FloatingLabel>

            <FloatingLabel controlId="passwordConfirm" label="Password Confirm">
              <Form.Control
                autoComplete="off"
                className="mb-3"
                isInvalid={password !== passwordConfirm}
                onChange={(e) =>
                  handleChange("passwordConfirm", e.target.value)
                }
                placeholder="Confirm your password"
                type="password"
                value={passwordConfirm}
              />
            </FloatingLabel>

            <Button
              className="w-100"
              disabled={loading}
              size="lg"
              type="submit"
              variant="dark"
            >
              <Spinner
                animation="border"
                aria-hidden="true"
                as="span"
                className="me-3"
                hidden={!loading}
                role="status"
                size="sm"
              />
              Sign Up
            </Button>
            <p className="text-start mt-4 mb-3">
              Already have an account? <a href="/login">Sign In</a>.
            </p>
          </div>
        </Form>
      </main>

      <ToastComp
        bg="danger"
        content={toastMsg}
        delay={5000}
        position="bottom-end"
        show={showToast}
        setShow={setShowToast}
        title="Register Error"
      />
    </>
  );
};

export default Register;
