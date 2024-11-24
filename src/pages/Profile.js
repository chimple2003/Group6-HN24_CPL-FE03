import React, { useEffect, useState } from "react";
import { useAcountStore } from "../stores/auth"; // Import store người dùng
import { BASE_URL } from "../constants/setting";
import Banner from "../components/Banner";
import ListPage from "../components/ListPage";
import { useSearchParams } from "react-router-dom";
import { TopicListStoreProvider } from "../stores/topic";

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
            console.log("Profile data:", data.profile); // Log thông tin profile
            setProfile(data.profile); // Lưu thông tin profile vào state
          } else {
            console.error("Error fetching user data");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        } finally {
          setLoading(false); // Đặt lại trạng thái loading khi fetch xong
        }
      };

      fetchUserProfile();
    } else {
      console.error("User not logged in or no username found");
      setLoading(false);
    }
  }, [user?.username]); // Chạy lại khi `user?.username` thay đổi

  const tabs = [
    { key: "topics", label: "Topics", visibility: 1 },
    { key: "favorites", label: "Favorites", visibility: 1 },
  ];

  const handleTabSelect = (key) => {
    if (key === "topics") {
      setActiveKey(key);
      searchParams.delete("page");
      searchParams.delete("tab");
      setSearchParams({ ...searchParams });
    } else {
      setActiveKey(key);
      searchParams.delete("page");
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        tab: key,
      });
    }
  };

  const generateBanner = (user, profile) => {
    if (!profile) return null; // Nếu chưa có profile, không render gì

    return (
      <Banner>
        <h2>
          <img
            alt={profile?.username}
            src={profile?.image} // Lấy image từ profile
            title={profile?.username}
            width={100}
          />
        </h2>
        <h4 className="mt-3">{profile?.username}</h4>
        <p className="text-secondary">{profile?.bio}</p>
      </Banner>
    );
  };

  if (loading) {
    return <p>Loading...</p>; // Hiển thị khi dữ liệu đang được tải
  }

  return (
    <TopicListStoreProvider activeKey={activeKey}>
      <ListPage
        activeKey={activeKey}
        BannerComp={() => generateBanner(user, profile)} // Truyền đúng user và profile
        defaultActiveKey="topics"
        handleTabSelect={handleTabSelect}
        tabs={tabs}
      />
    </TopicListStoreProvider>
  );
};

export default Profile;
