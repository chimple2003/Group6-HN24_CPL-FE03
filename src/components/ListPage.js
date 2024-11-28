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

const ListPage = ({
  activeKey,
  BannerComp,
  defaultActiveKey,
  handleTabSelect, // Đảm bảo rằng handleTabSelect được truyền từ HomePage
  tabs,
}) => {
  const { user } = useAcountStore();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";
  const { fetchTopicList, theUser = {} } = useTopicListStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const isTag = activeKey.startsWith("tag-"); // Kiểm tra tab có phải tag
        const tag = isTag ? activeKey.replace("tag-", "") : ""; // Lấy tag nếu có

        const articles = await fetchTopicList({
          page: parseInt(page, 10),
          tag,
        });

        console.log("Fetched Articles:", articles); // Kiểm tra bài viết trả về
      } catch (err) {
        console.error("Error fetching topic list:", err);
      }
    };

    fetchData();
  }, [activeKey, page]); // Theo dõi thay đổi activeKey và page

  return (
    <>
      <Header />
      {typeof BannerComp === "function" ? BannerComp(theUser) : BannerComp}
      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <TabsComponent
              activeKey={activeKey}
              defaultActiveKey={defaultActiveKey}
              handleTabSelect={handleTabSelect} // Truyền xuống đây
              tabs={tabs}
            />
            <ListView activeKey={activeKey} handleTabSelect={handleTabSelect} />
            <PaginationComp activeKey={activeKey} />
          </div>
          <aside className="col-md-3">
            <div className="sidebar">
              <h6>Popular Tags</h6>
              <div className="tag-list">
                <Tags onTagSelect={handleTabSelect} />{" "}
                {/* Truyền handleTabSelect xuống Tags */}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default ListPage;
