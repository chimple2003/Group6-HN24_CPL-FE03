import React, { useEffect, useState } from "react";
import { useAcountStore } from "../stores/auth";
import { BASE_URL } from "../constants/setting";
import { useSearchParams } from "react-router-dom";
import { TopicListStoreProvider, useTopicListStore } from "../stores/topic";
import Header from "../components/Header";
import TabsComponent from "../components/TabsComponent";
import ListView from "../components/ListView";
import PaginationComp from "../components/PaginationComp";
import Tags from "./Tags";

const ProfileContent = ({ activeKey, profile, handleTabSelect }) => {
  const { fetchTopicList, topicList, loading, error } = useTopicListStore();
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);

  // Determine the type of list to fetch based on activeKey
  useEffect(() => {
    const fetchProfileContent = async () => {
      try {
        if (activeKey === "topics") {
          // Fetch user's topics
          await fetchTopicList({ page, author: profile.username });
        } else if (activeKey === "favorites") {
          // Fetch user's favorite topics
          await fetchTopicList({ page, favorited: profile.username });
        }
      } catch (err) {
        console.error("Error fetching profile content:", err);
      }
    };

    fetchProfileContent();
  }, [activeKey, page, profile.username]);

  return (
    <div className="container page">
      <div className="row">
        <div className="col-md-9">
          <TabsComponent
            activeKey={activeKey}
            handleTabSelect={handleTabSelect}
          />
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            <ListView activeKey={activeKey} topicList={topicList} />
          )}
          <PaginationComp />
        </div>
        <aside className="col-md-3">
          <div className="sidebar">
            <h6>Popular Tags</h6>
            <div className="tag-list">
              <Tags />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const Profile = () => {
  const { user } = useAcountStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "topics";
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
              headers: {
                accept: "application/json",
              },
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

  const tabs = [
    { key: "topics", label: "My Topics", visibility: 1 },
    { key: "favorites", label: "Favorites", visibility: 1 },
  ];

  const handleTabSelect = (key) => {
    setActiveKey(key);
    const newSearchParams = new URLSearchParams(searchParams);

    if (key === "topics") {
      newSearchParams.delete("tab");
    } else {
      newSearchParams.set("tab", key);
    }

    newSearchParams.delete("page");
    setSearchParams(newSearchParams);
  };

  const Banner = () => {
    if (!profile) return null;

    return (
      <div className="profile-banner">
        <div className="container">
          <div className="profile-header text-center">
            <img
              src={profile.image}
              alt={profile.username}
              className="profile-avatar"
              width={150}
              height={150}
            />
            <h2 className="mt-3">{profile.username}</h2>
            <p className="text-secondary">
              {profile.bio || "No bio available"}
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>No profile found</div>;
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
