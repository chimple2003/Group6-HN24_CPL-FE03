import React, { useEffect, useState } from "react";
import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import {
  Badge,
  Button,
  Spinner,
  Form,
  Card,
  Row,
  Col,
  ListGroup,
  Modal,
} from "react-bootstrap";
import axios from "../utils/axios";
import { API_PREFIX } from "../constants/setting";
import Header from "../components/Header";
import { useAcountStore } from "../stores/auth";

const TopicDetails = () => {
  const { slug } = useParams();
  const { user } = useAcountStore(); // Get the logged-in user
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedBody, setEditedBody] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentBody, setEditedCommentBody] = useState("");

  const ARTICLES_PER_PAGE = 5;
  const navigate = useNavigate();
  useEffect(() => {
    const fetchTopicDetails = async () => {
      try {
        const { data } = await axios.get(`${API_PREFIX}/articles/${slug}`);
        setTopic(data.article);
        setEditedTitle(data.article.title);
        setEditedBody(data.article.body);

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
    if (!user || !user.username) {
      alert("You need to log in to follow users.");
      navigate("/login");
      return;
    }
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
    if (!user || !user.username) {
      alert("You need to log in to add comments.");
      navigate("/login");
      return;
    }
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
    if (!user || !user.username) {
      alert("You need to log in to like articles.");
      navigate("/login");
      return;
    }
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

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(
        `${API_PREFIX}/articles/${slug}/comments/${commentId}`
      );
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  const handleEditComment = async () => {
    if (!editedCommentBody.trim()) return;
    try {
      await axios.put(
        `${API_PREFIX}/articles/${slug}/comments/${editingCommentId}`,
        {
          comment: { body: editedCommentBody },
        }
      );
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === editingCommentId
            ? { ...comment, body: editedCommentBody }
            : comment
        )
      );
      setEditingCommentId(null);
      setEditedCommentBody("");
    } catch (err) {
      console.error("Failed to edit comment:", err);
    }
  };

  const handleEditArticle = async () => {
    try {
      const { data } = await axios.put(`${API_PREFIX}/articles/${slug}`, {
        article: {
          title: editedTitle,
          body: editedBody,
        },
      });
      setTopic(data.article);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to edit article:", err);
    }
  };

  const handleDeleteArticle = async () => {
    try {
      await axios.delete(`${API_PREFIX}/articles/${slug}`);
      window.location.href = "/";
    } catch (err) {
      console.error("Failed to delete article:", err);
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

  // Check if the logged-in user is the author of the article
  const isAuthor = user.username === author.username;

  return (
    <div className="container-fluid py-4">
      <Header />
      {topic && (
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            {/* Article Section */}
            <Card className="shadow-sm mb-4">
              <Card.Body>
                {isEditing ? (
                  <Form>
                    <Form.Group controlId="editTitle" className="mb-3">
                      <Form.Label>Title</Form.Label>
                      <Form.Control
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group controlId="editBody" className="mb-3">
                      <Form.Label>Content</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={8}
                        value={editedBody}
                        onChange={(e) => setEditedBody(e.target.value)}
                      />
                    </Form.Group>
                    <div className="d-flex justify-content-between">
                      <Button variant="primary" onClick={handleEditArticle}>
                        Save Changes
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form>
                ) : (
                  <>
                    <Card.Title className="text-center mb-3">
                      {topic.title}
                    </Card.Title>
                    <Card.Subtitle className="text-muted text-center mb-3">
                      Published on {new Date(topic.createdAt).toLocaleString()}
                    </Card.Subtitle>
                    <Card.Text>{topic.body}</Card.Text>

                    <div className="d-flex justify-content-center gap-2 mt-3">
                      <Button
                        variant={
                          topic.favorited ? "success" : "outline-success"
                        }
                        onClick={handleLikeToggle}
                      >
                        {topic.favorited ? "Unlike" : "Like"} (
                        {topic.favoritesCount})
                      </Button>

                      {/* Conditionally render Edit and Delete buttons */}
                      {isAuthor && (
                        <>
                          <Button
                            variant="warning"
                            onClick={() => setIsEditing(true)}
                          >
                            Edit Article
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => setShowDeleteModal(true)}
                          >
                            Delete Article
                          </Button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>

            {/* Delete Confirmation Modal */}
            <Modal
              show={showDeleteModal}
              onHide={() => setShowDeleteModal(false)}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Confirm Article Deletion</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to delete this article? This action cannot
                be undone.
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    setShowDeleteModal(false);
                    handleDeleteArticle();
                  }}
                >
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Author Section */}
            <Card className="shadow-sm mb-4">
              <Card.Header as="h5" className="bg-light">
                About the Author
              </Card.Header>
              <Card.Body className="d-flex align-items-center">
                <img
                  src={author.image || "/path/to/default-avatar.png"}
                  alt={author.username}
                  className="rounded-circle me-3 shadow-sm"
                  height="60"
                  width="60"
                />
                <div className="flex-grow-1">
                  <h5 className="mb-2">{author.username}</h5>
                  <Button
                    variant={isFollowing ? "outline-secondary" : "primary"}
                    size="sm"
                    onClick={handleFollowToggle}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* Other Articles Section */}
            <Card className="shadow-sm mb-4">
              <Card.Header as="h5" className="bg-light">
                Other Articles by {author.username}
              </Card.Header>
              <ListGroup variant="flush">
                {authorArticles.length > 0 ? (
                  authorArticles.map((article) => (
                    <ListGroup.Item
                      key={article.slug}
                      action
                      className="d-flex justify-content-between align-items-center"
                    >
                      <Link
                        to={`/topic/${article.slug}`}
                        className="text-decoration-none"
                      >
                        {article.title}
                      </Link>
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item className="text-muted">
                    No other articles by this author
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card>

            {/* Comments Section */}
            <Card className="shadow-sm mb-4">
              <Card.Header as="h5" className="bg-light">
                Comments
              </Card.Header>
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
                  <Button
                    variant="primary"
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                  >
                    Add Comment
                  </Button>
                </Form>

                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <Card key={comment.id} className="mb-3 shadow-sm">
                      <Card.Body>
                        <div className="d-flex align-items-center mb-2">
                          <img
                            src={
                              comment.author.image ||
                              "/path/to/default-avatar.png"
                            }
                            alt={comment.author.username}
                            className="rounded-circle me-2"
                            height="40"
                            width="40"
                          />
                          <div>
                            <strong>{comment.author.username}</strong>
                            <small className="text-muted d-block">
                              {new Date(comment.createdAt).toLocaleString()}
                            </small>
                          </div>
                        </div>

                        {editingCommentId === comment.id ? (
                          <Form>
                            <Form.Control
                              as="textarea"
                              value={editedCommentBody}
                              onChange={(e) =>
                                setEditedCommentBody(e.target.value)
                              }
                              rows={3}
                            />
                            <div className="d-flex justify-content-end mt-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                className="me-2"
                                onClick={() => {
                                  setEditingCommentId(null);
                                  setEditedCommentBody("");
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={handleEditComment}
                              >
                                Save
                              </Button>
                            </div>
                          </Form>
                        ) : (
                          <>
                            <p>{comment.body}</p>
                            {/* Only show edit/delete for comment author */}
                            {user.username === comment.author.username && (
                              <div className="d-flex justify-content-end">
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  className="me-2"
                                  onClick={() => {
                                    setEditingCommentId(comment.id);
                                    setEditedCommentBody(comment.body);
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteComment(comment.id)
                                  }
                                >
                                  Delete
                                </Button>
                              </div>
                            )}
                          </>
                        )}
                      </Card.Body>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted text-center">No comments yet</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default TopicDetails;
