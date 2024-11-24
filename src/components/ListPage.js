import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import TabsComponent from "./TabsComponent";
import ListView from "./ListView";
import PaginationComp from "./PaginationComp";
import "./ListPage.css";
import { useAcountStore } from "../stores/auth";

import { useTopicListStore } from "../stores/topic";

const ListPage = ({
  activeKey,
  BannerComp,
  defaultActiveKey,
  handleTabSelect,
  tabs,
}) => {
  const { user } = useAcountStore();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";
  const { fetchTopicList, theUser = {} } = useTopicListStore();

  useEffect(() => {
    console.log(user);
    fetchTopicList({
      page: parseInt(page, 10),
      tag: activeKey === "all" ? "" : activeKey,
    }).catch((err) => console.error("fetchTopicList error:", err));
  }, [activeKey, page]);

  return (
    <>
      <Header />
      {typeof BannerComp === "function" ? BannerComp(theUser) : BannerComp}
      <main className="main mx-auto">
        <TabsComponent
          activeKey={activeKey}
          defaultActiveKey={defaultActiveKey}
          handleTabSelect={handleTabSelect}
          tabs={tabs}
        />
        <ListView activeKey={activeKey} handleTabSelect={handleTabSelect} />
        <PaginationComp activeKey={activeKey} />
      </main>
    </>
  );
};

export default ListPage;
