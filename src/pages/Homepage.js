import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Banner from "../components/Banner";
import ListPage from "../components/ListPage";

import { TopicListStoreProvider } from "../stores/topic";

const Homepage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "all"; // Lấy tab từ URL hoặc mặc định là "all"
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

  // Xử lý khi người dùng chọn tab
  const handleTabSelect = (key) => {
    if (key === "sign-in") {
      navigate("/login"); // Điều hướng đến trang đăng nhập
    } else {
      setActiveKey(key); // Cập nhật tab đang hoạt động

      // Cập nhật URL
      const updatedParams = new URLSearchParams(searchParams);
      updatedParams.delete("page"); // Xóa tham số "page" nếu có
      if (key === "all") {
        updatedParams.delete("tab");
      } else {
        updatedParams.set("tab", key);
      }
      setSearchParams(updatedParams);

      // Xóa tab tag cũ và thêm tag mới
      if (key.startsWith("tag-")) {
        setTabs((prevTabs) => [
          ...prevTabs.filter((tab) => !tab.key.startsWith("tag-")), // Xóa tất cả các tab dạng tag-
          { key, label: `#${key.replace("tag-", "")}`, visibility: 0 }, // Thêm tab tag mới
        ]);
      }
    }
  };

  // Lắng nghe thay đổi của URL và cập nhật tab
  useEffect(() => {
    setActiveKey(tab);

    // Xóa tab tag cũ và thêm tab mới khi URL thay đổi
    if (tab.startsWith("tag-")) {
      setTabs((prevTabs) => [
        ...prevTabs.filter((t) => !t.key.startsWith("tag-")), // Xóa tất cả các tab dạng tag-
        { key: tab, label: `#${tab.replace("tag-", "")}`, visibility: 0 }, // Thêm tab mới
      ]);
    }
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
