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

  // Trạng thái "đã chạm" vào các trường
  const [touched, setTouched] = useState({
    email: false,
    username: false,
    password: false,
    passwordConfirm: false,
  });

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

  const handleBlur = (type) => {
    setTouched({ ...touched, [type]: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!e.currentTarget.checkValidity()) {
      return;
    }

    try {
      const { data = {} } = await axios.post(
        "https://node-express-conduit.appspot.com/api/users",
        {
          user: { username, email, password },
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const user = data.user;
      const token = user?.token;

      if (!user || !token) {
        throw new Error("Registration failed: Missing user or token.");
      }

      login(user, token);
      await loadingDelay(400);
      setLoading(false);
      navigate("/");
    } catch (err) {
      await loadingDelay(300);
      setLoading(false);
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
                  touched.email &&
                  !email.match(
                    /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
                  )
                }
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                placeholder="username@example.com"
                type="email"
                value={email}
              />
            </FloatingLabel>

            <FloatingLabel controlId="username" label="Username">
              <Form.Control
                autoComplete="off"
                isInvalid={touched.username && !username}
                onChange={(e) => handleChange("username", e.target.value)}
                onBlur={() => handleBlur("username")}
                placeholder="Username"
                required
                type="text"
                value={username}
              />
            </FloatingLabel>

            <FloatingLabel controlId="password" label="Password">
              <Form.Control
                autoComplete="off"
                isInvalid={touched.password && !password}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
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
                isInvalid={
                  touched.passwordConfirm && password !== passwordConfirm
                }
                onChange={(e) =>
                  handleChange("passwordConfirm", e.target.value)
                }
                onBlur={() => handleBlur("passwordConfirm")}
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
