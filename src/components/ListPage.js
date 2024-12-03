import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import TabsComponent from "./TabsComponent";
import ListView from "./ListView";
import PaginationComp from "./PaginationComp";
import "./ListPage.css";
import { useTopicListStore } from "../stores/topic";
import Tags from "../pages/Tags";

const ListPage = ({ BannerComp }) => {
  const { fetchTopicList, getArticlesFeed, topicList, loading, error } =
    useTopicListStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Lấy giá trị activeKey từ URL hoặc đặt mặc định là "global-feed"
  const activeKey = searchParams.get("tab") || "global-feed";
  const page = parseInt(searchParams.get("page") || "1", 10);

  // Trích xuất thông tin tag từ activeKey
  const tag = activeKey.startsWith("tag-") ? activeKey.replace("tag-", "") : "";

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        if (activeKey === "your-feed") {
          await getArticlesFeed({ page });
        } else if (activeKey === "global-feed") {
          await fetchTopicList({ page });
        } else if (tag) {
          await fetchTopicList({ page, tag });
        }
      } catch (err) {
        console.error("Error fetching articles:", err);
      }
    };

    fetchArticles();
  }, [activeKey, page]);

  // Đồng bộ URL lần đầu render nếu không có activeKey trong URL
  useEffect(() => {
    if (!searchParams.get("tab")) {
      setSearchParams({ tab: "global-feed", page: 1 });
    }
  }, []); // Chỉ chạy khi lần đầu render

  return (
    <>
      <Header />
      {BannerComp}
      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <TabsComponent
              activeKey={activeKey}
              handleTabSelect={(key) => {
                navigate(`/?tab=${key}&page=1`);
              }}
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
          <PaginationComp />
        </div>
      </div>
    </>
  );
};

export default ListPage;
