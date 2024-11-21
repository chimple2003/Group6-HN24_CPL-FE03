import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Banner from "../components/Banner";
import { useNavigate } from "react-router-dom";
import {  Container } from "react-bootstrap";
import axios from "axios";
import { loadingDelay } from "../utils/loading";
import { BASE_URL } from "../constants/setting";
import "./Tag.css"
const Tags = () => {
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchTag = async () => {  
      try {
        await loadingDelay(2000);
        const response = await axios.get(`${BASE_URL}/api/tags`);
        console.log(response.data.tags); 
        setTags(response.data.tags || []);
      } catch (err) {
        setError("Error fetching tags");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTag();
  }, []);
  return (
    <div>
    <Header />
    <Banner>
      <h2>Tags Cloud</h2>
    </Banner>
    <div className="m-5 fs-2 badge text-bg-primary text-wrap">
    Popular Tag
    </div>
    <Container>
      {loading && <p>Loading tags...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {tags.map((tag, index) => (
        <span
          className={`tag-item ${index === 0 ? '' : 'ms-2'}`}
          key={tag}
          onClick={() => navigate(`/tags/${tag}`)} //
        >
          {tag}
        </span>
      ))}
    </Container>
  </div>
  );
};

export default Tags;
