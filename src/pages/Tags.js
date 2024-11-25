import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../constants/setting";
import "./Tag.css";

const Tags = () => {
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/tags`);
        setTags(response.data.tags || []);
      } catch (err) {
        setError("Error fetching tags");
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, []);

  const handleTagClick = (tag) => {
    navigate(`/?tab=tag-${tag}`); // Chuyển tab và cập nhật URL
  };

  if (loading) return <p>Loading tags...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="tags-container">
      {tags.map((tag) => (
        <button
          className="tag-pill tag-default"
          key={tag}
          onClick={() => handleTagClick(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default Tags;
