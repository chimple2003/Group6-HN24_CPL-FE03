import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Form, Button, FloatingLabel, Spinner } from "react-bootstrap";
import Header from "../components/Header";
import ToastComp from "../components/ToastComp";
import Logo from "../assets/images/nodejs.ico";
import axios from "../utils/axios";
import { useAcountStore, useLoadingStore } from "../stores/auth";
import { loadingDelay } from "../utils/loading";

const Login = () => {
  const navigate = useNavigate();
  const { loading = false, setLoading } = useLoadingStore();
  const [searchParams] = useSearchParams();
  const defaultEmail = searchParams.get("email") || "";
  const redirect = searchParams.get("redirect") || "/";
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const { login } = useAcountStore();

  const handleChange = (type, val) => {
    if (type === "email") {
      setEmail(val);
    } else if (type === "password") {
      setPassword(val);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.checkValidity()) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/users/login", {
        user: { email, password },
      });

      const { user } = response.data;
      const { username, token } = user;

      // Lưu thông tin vào localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      login(user, token);
      await loadingDelay(400);
      setLoading(false);

      navigate(redirect);
    } catch (err) {
      console.error("Login error:", err);
      await loadingDelay(300);
      setLoading(false);

      const errorMessage = err.msg || "Invalid email or password.";
      setToastMsg(errorMessage);
      setShowToast(true);
    }
  };

  return (
    <>
      <Header />
      <main className="mx-auto p-3">
        <div className="d-flex justify-content-center align-items-center">
          <Form
            className="text-center justify-content-center align-items-center"
            noValidate
            onSubmit={handleSubmit}
            style={{ width: "100%", maxWidth: "350px" }}
          >
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
                placeholder="name@example.com"
                required
                type="email"
                value={email}
              />
            </FloatingLabel>

            <FloatingLabel controlId="password" label="Password">
              <Form.Control
                autoComplete="off"
                className="mb-3 w-100"
                isInvalid={!password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Password"
                required
                type="password"
                value={password}
              />
            </FloatingLabel>

            <Button
              className="w-100"
              disabled={loading}
              variant="dark"
              size="lg"
              type="submit"
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
              Sign In
            </Button>

            <p className="text-start mt-4 mb-3">
              Need an account? <a href="/register">Sign Up</a>.
            </p>
          </Form>
        </div>
      </main>

      <ToastComp
        bg="danger"
        content={toastMsg}
        delay={5000}
        position="bottom-end"
        show={showToast}
        setShow={setShowToast}
        title="Login Error"
      />
    </>
  );
};

export default Login;
