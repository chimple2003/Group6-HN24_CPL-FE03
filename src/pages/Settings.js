import React, { useState } from "react";
import Header from "../components/Header";
import "./Setting.css";
import { useAcountStore } from "../stores/auth";
import axios from "axios";
import { Container } from "react-bootstrap";

const BASE_URL = "https://node-express-conduit.appspot.com";
const API_PREFIX = `${BASE_URL}/api`;

const Settings = () => {
  const { user, update } = useAcountStore(); // Lấy thông tin user từ store và hàm cập nhật
  const [formData, setFormData] = useState({
    image: user.image || "",
    username: user.username || "",
    email: user.email || "",
    bio: user.bio || "",
    password: "", // Password không hiển thị
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // Cập nhật state khi người dùng nhập
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Gửi request cập nhật thông tin
      const { data } = await axios.put(
        `${API_PREFIX}/user`,
        {
          user: {
            email: formData.email,
            username: formData.username,
            bio: formData.bio,
            image: formData.image,
            ...(formData.password && { password: formData.password }), // Chỉ gửi password nếu được nhập
          },
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`, // Token xác thực
          },
        }
      );

      // Cập nhật thông tin trong store
      update(data.user);

      alert("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error(
        "Lỗi khi cập nhật thông tin:",
        error.response?.data || error
      );
      alert("Cập nhật thông tin thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <>
      <Header />

      <div className="">
        <div className="">
          <div className="">
            <h1 className="text-center">Your Settings</h1>
            <form onSubmit={handleSubmit}>
              <fieldset className="container">
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    name="image"
                    placeholder="URL of profile picture"
                    value={formData.image}
                    onChange={handleChange}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    name="username"
                    placeholder="Your Name"
                    required
                    value={formData.username}
                    onChange={handleChange}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    name="email"
                    placeholder="Email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control form-control-lg"
                    name="bio"
                    placeholder="Short bio about you"
                    value={formData.bio}
                    onChange={handleChange}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    name="password"
                    placeholder="Password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </fieldset>
                <button
                  type="submit"
                  className="btn btn-lg btn-primary pull-xs-right"
                >
                  Update Settings
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
