import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Nav,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useAcountStore } from "../stores/auth";
import { BASE_URL } from "../constants/setting";
import { useSearchParams } from "react-router-dom";
import { TopicListStoreProvider, useTopicListStore } from "../stores/topic";
import Header from "../components/Header";
import ListItem from "../components/ListItem";
import { Pagination } from "react-bootstrap";
const TabsComponent = ({ activeKey, handleTabSelect }) => {
  const tabs = [
    { key: "my-feed", label: "My Articles" },
    { key: "my-favorite", label: "Favorited Articles" },
  ];

  return (
    <Nav
      variant="tabs"
      activeKey={activeKey}
      className="mb-3"
      onSelect={handleTabSelect}
    >
      {tabs.map((tab) => (
        <Nav.Item key={tab.key}>
          <Nav.Link eventKey={tab.key}>{tab.label}</Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
};

const paginateTopics = (topics, currentPage = 1, itemsPerPage = 5) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedTopics = topics.slice(startIndex, endIndex);
  const totalPages = Math.ceil(topics.length / itemsPerPage);

  return {
    paginatedTopics,
    totalPages,
    currentPage,
  };
};

const ProfileContent = ({ activeKey, profile, handleTabSelect }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { fetchTopicList, topicList, loading, error, total } =
    useTopicListStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);

  // Phân trang
  const { paginatedTopics, totalPages } = paginateTopics(
    topicList,
    currentPage
  );

  useEffect(() => {
    const fetchProfileContent = async () => {
      try {
        if (activeKey === "my-feed") {
          await fetchTopicList({ page, author: profile.username });
        }
        if (activeKey === "my-favorite") {
          await fetchTopicList({ page, favorited: profile.username });
        }
      } catch (err) {
        console.error("Error fetching profile content:", err);
      }
    };

    fetchProfileContent();
  }, [activeKey, page, profile.username]);

  // Thêm nút phân trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);

    // Cập nhật URL
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", pageNumber);
    setSearchParams(newSearchParams);
  };

  return (
    <Container>
      <Row>
        <Col md={12}>
          <TabsComponent
            activeKey={activeKey}
            handleTabSelect={handleTabSelect}
          />

          {loading ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <>
              {paginatedTopics.length === 0 ? (
                <Alert variant="info" className="text-center">
                  No articles available for this section.
                </Alert>
              ) : (
                <>
                  {paginatedTopics.map((item) => (
                    <ListItem key={item.slug} topic={item} />
                  ))}

                  {totalPages > 1 && (
                    <Pagination className="d-flex justify-content-center mt-4">
                      <Pagination.Prev
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      />
                      {[...Array(totalPages)].map((_, index) => (
                        <Pagination.Item
                          key={index}
                          active={index + 1 === currentPage}
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </Pagination.Item>
                      ))}
                      <Pagination.Next
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      />
                    </Pagination>
                  )}
                </>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};
const Profile = () => {
  const { user } = useAcountStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "my-feed";
  const [activeKey, setActiveKey] = useState(tab);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.username) {
      const fetchUserProfile = async () => {
        try {
          const response = await fetch(
            `${BASE_URL}/api/profiles/${user.username}`,
            {
              method: "GET",
              headers: { accept: "application/json" },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setProfile(data.profile);
          } else {
            console.error("Error fetching user data");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserProfile();
    } else {
      console.error("User not logged in or no username found");
      setLoading(false);
    }
  }, [user?.username]);

  const handleTabSelect = (key) => {
    setActiveKey(key);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("tab", key);
    newSearchParams.delete("page");
    setSearchParams(newSearchParams);
  };

  const Banner = () => {
    if (!profile) return null;

    return (
      <div className="bg-light py-5 mb-4">
        <Container>
          <Card className="text-center border-0 bg-transparent">
            <div className="d-flex flex-column align-items-center">
              <img
                src={
                  profile.image ||
                  "https://api.realworld.io/images/smiley-cyrus.jpg"
                }
                alt={profile.username}
                className="rounded-circle mb-3"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
              <Card.Title as="h2" className="mb-2">
                {profile.username}
              </Card.Title>
              <Card.Text className="text-muted">
                {profile.bio || "No bio available"}
              </Card.Text>
            </div>
          </Card>
        </Container>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!profile) {
    return (
      <Alert variant="warning" className="text-center">
        No profile found
      </Alert>
    );
  }

  return (
    <TopicListStoreProvider activeKey={activeKey}>
      <Header />
      <Banner />
      <ProfileContent
        activeKey={activeKey}
        profile={profile}
        handleTabSelect={handleTabSelect}
      />
    </TopicListStoreProvider>
  );
};

export default Profile;
