import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Banner from "../components/Banner";
import ListPage from "../components/ListPage";

import { TopicListStoreProvider } from "../stores/topic";

const Homepage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "all";
  const [activeKey, setActiveKey] = useState(tab);
  const [tabs, setTabs] = useState([
    { key: "all", label: "All Topics", visibility: 0 },
    { key: "my-topics", label: "My Topics", visibility: 1 },
    { key: "my-favorites", label: "My Favorites", visibility: 1 },
    {
      key: "sign-in",
      label: "Sign in to see your own topics & favorites",
      visibility: -1,
    },
  ]);

  // Thêm tab mới khi chọn tag
  const handleTabSelect = (key) => {
    if (key === "sign-in") {
      navigate("/login");
    } else if (key === "all") {
      setActiveKey(key);
      searchParams.delete("page");
      searchParams.delete("tab");
      setSearchParams({ ...searchParams });
    } else {
      setActiveKey(key);
      searchParams.delete("page");
      setSearchParams({
        ...searchParams,
        tab: key,
      });

      // Thêm tab tag nếu chưa có
      if (!tabs.some((tab) => tab.key === key)) {
        setTabs((prevTabs) => [
          ...prevTabs,
          { key, label: `#${key}`, visibility: 0 }, // Hiển thị tag dưới dạng `#tag`
        ]);
      }
    }
  };

  useEffect(() => {
    setActiveKey(tab); // Cập nhật activeKey khi URL thay đổi
  }, [tab]);

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
        tabs={tabs}
      />
    </TopicListStoreProvider>
  );
};

export default Homepage;
