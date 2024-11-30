import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Banner from "../components/Banner";
import ListPage from "../components/ListPage";

import { TopicListStoreProvider } from "../stores/topic";
import { useAcountStore } from "../stores/auth"; // Giả sử bạn có store này

const Homepage = () => {
  const navigate = useNavigate();
  const { user } = useAcountStore(); // Lấy thông tin người dùng từ store
  const [searchParams, setSearchParams] = useSearchParams();

  const defaultTab = user?.username ? "your-feed" : "global-feed";
  const tabParam = searchParams.get("tab") || defaultTab;
  const [activeKey, setActiveKey] = useState(tabParam);

  useEffect(() => {
    if (!user?.username && activeKey === "your-feed") {
      // Nếu chưa đăng nhập và đang ở Your Feed, chuyển về Global Feed
      navigate("/?tab=global-feed");
    } else {
      setActiveKey(tabParam);
    }
  }, [tabParam, user]);

  const handleTabSelect = (key) => {
    setActiveKey(key);

    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.set("tab", key);
    setSearchParams(updatedParams);
  };

  return (
    <TopicListStoreProvider activeKey={activeKey}>
      <ListPage
        activeKey={activeKey}
        BannerComp={
          <Banner>
            <h1>Conduit</h1>
            <p>A place to share your knowledge.</p>
          </Banner>
        }
        handleTabSelect={handleTabSelect}
      />
    </TopicListStoreProvider>
  );
};

export default Homepage;
