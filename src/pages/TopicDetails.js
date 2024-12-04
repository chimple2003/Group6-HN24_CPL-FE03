import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Badge,
  Button,
  Spinner,
  Form,
  Card,
  Row,
  Col,
  ListGroup,
} from "react-bootstrap";
import axios from "../utils/axios";
import { API_PREFIX } from "../constants/setting";

const TopicDetail = () => {
  const { slug } = useParams();
  const [topic, setTopic] = useState(null);
  const [author, setAuthor] = useState(null);
  const [authorArticles, setAuthorArticles] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ARTICLES_PER_PAGE = 5;

  useEffect(() => {
    const fetchTopicDetails = async () => {
      try {
        const { data } = await axios.get(`${API_PREFIX}/articles/${slug}`);
        setTopic(data.article);

        const authorResponse = await axios.get(
          `${API_PREFIX}/profiles/${data.article.author.username}`
        );
        setAuthor(authorResponse.data.profile);
        setIsFollowing(authorResponse.data.profile.following);

        const authorArticlesResponse = await axios.get(
          `${API_PREFIX}/articles?author=${
            data.article.author.username
          }&limit=${ARTICLES_PER_PAGE}&offset=${
            (currentPage - 1) * ARTICLES_PER_PAGE
          }`
        );
        setAuthorArticles(authorArticlesResponse.data.articles);
        setTotalPages(
          Math.ceil(
            authorArticlesResponse.data.articlesCount / ARTICLES_PER_PAGE
          )
        );

        const commentsResponse = await axios.get(
          `${API_PREFIX}/articles/${slug}/comments`
        );
        setComments(commentsResponse.data.comments);
      } catch (err) {
        setError("Failed to fetch topic details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopicDetails();
  }, [slug, currentPage]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await axios.delete(`${API_PREFIX}/profiles/${author.username}/follow`);
      } else {
        await axios.post(`${API_PREFIX}/profiles/${author.username}/follow`);
      }
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Failed to follow/unfollow user:", err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const { data } = await axios.post(
        `${API_PREFIX}/articles/${slug}/comments`,
        {
          comment: { body: newComment },
        }
      );
      setComments((prevComments) => [data.comment, ...prevComments]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const handleLikeToggle = async () => {
    try {
      if (topic.favorited) {
        await axios.delete(`${API_PREFIX}/articles/${slug}/favorite`);
      } else {
        await axios.post(`${API_PREFIX}/articles/${slug}/favorite`);
      }
      setTopic({
        ...topic,
        favorited: !topic.favorited,
        favoritesCount: topic.favorited
          ? topic.favoritesCount - 1
          : topic.favoritesCount + 1,
      });
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      {topic && (
        <>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title className="text-center">{topic.title}</Card.Title>
              <Card.Text className="text-muted text-center">
                {new Date(topic.createdAt).toLocaleString()}
              </Card.Text>
              <Card.Text>{topic.body}</Card.Text>
              <div className="text-center">
                <Button
                  variant={topic.favorited ? "success" : "outline-success"}
                  onClick={handleLikeToggle}
                >
                  {topic.favorited ? "Unlike" : "Like"} ({topic.favoritesCount})
                </Button>
              </div>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header as="h5">About the Author</Card.Header>
            <Card.Body className="d-flex align-items-center">
              <img
                src={author.image || "/path/to/default-avatar.png"}
                alt={author.username}
                className="rounded-circle me-3"
                height="50"
                width="50"
              />
              <div>
                <h5 className="mb-0">{author.username}</h5>
                <Button
                  variant={isFollowing ? "secondary" : "primary"}
                  size="sm"
                  onClick={handleFollowToggle}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              </div>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header as="h5">
              Other Articles by {author.username}
            </Card.Header>
            <ListGroup variant="flush">
              {authorArticles.map((article) => (
                <ListGroup.Item key={article.slug}>
                  <Link to={`/topic/${article.slug}`}>{article.title}</Link>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>

          <Card className="mb-4">
            <Card.Header as="h5">Comments</Card.Header>
            <Card.Body>
              <Form className="mb-3">
                <Form.Group controlId="commentTextarea">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" onClick={handleAddComment}>
                  Add Comment
                </Button>
              </Form>
              {comments.map((comment) => (
                <div className="comment-item mb-3" key={comment.id}>
                  <div className="d-flex align-items-center">
                    <img
                      src={
                        comment.author.image || "/path/to/default-avatar.png"
                      }
                      alt={comment.author.username}
                      className="rounded-circle me-2"
                      height="40"
                      width="40"
                    />
                    <div>
                      <strong>{comment.author.username}</strong>
                      <p
                        className="text-muted mb-0"
                        style={{ fontSize: "0.8rem" }}
                      >
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2">{comment.body}</p>
                </div>
              ))}
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
};

export default TopicDetail;
