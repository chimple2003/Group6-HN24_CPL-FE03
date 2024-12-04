import React, { useState } from "react";
import axios from "../utils/axios";
import { API_PREFIX } from "../constants/setting";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";

const TopicInitiate = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      title,
      description,
      body: content,
      tagList: tags.split(",").map((tag) => tag.trim()),
    };

    try {
      await axios.post(`${API_PREFIX}/articles`, { article: payload });
      navigate("/"); // Điều hướng về trang chủ sau khi tạo thành công
    } catch (err) {
      setError("Failed to create topic. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Create New Topic
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            margin="normal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <TextField
            label="Content"
            variant="outlined"
            fullWidth
            multiline
            rows={5}
            margin="normal"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <TextField
            label="Tags (comma separated)"
            variant="outlined"
            fullWidth
            margin="normal"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? "Creating..." : "Create Topic"}
            </Button>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default TopicInitiate;
