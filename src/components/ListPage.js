import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import TabsComponent from "./TabsComponent";
import ListView from "./ListView";
import PaginationComp from "./PaginationComp";
import "./ListPage.css";
import { useAcountStore } from "../stores/auth";
import { useTopicListStore } from "../stores/topic";
import Tags from "../pages/Tags";

const ListPage = ({ activeKey, BannerComp, handleTabSelect }) => {
  const { fetchTopicList, topicList, loading, error } = useTopicListStore();
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);

  // Trích xuất thông tin tag từ activeKey
  const tag = activeKey.startsWith("tag-") ? activeKey.replace("tag-", "") : "";

  useEffect(() => {
    // Xác định API cần gọi dựa trên activeKey
    const fetchArticles = async () => {
      try {
        if (activeKey === "your-feed") {
          // Gọi API Your Feed
          await fetchTopicList({ page, feed: true });
        } else if (activeKey === "global-feed") {
          // Gọi API Global Feed
          await fetchTopicList({ page });
        } else if (tag) {
          // Gọi API với tag cụ thể
          await fetchTopicList({ page, tag });
        }
      } catch (err) {
        console.error("Error fetching articles:", err);
      }
    };

    fetchArticles();
  }, [activeKey, page]);

  return (
    <>
      <Header />
      {BannerComp}
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
    </>
  );
};

export default ListPage;
