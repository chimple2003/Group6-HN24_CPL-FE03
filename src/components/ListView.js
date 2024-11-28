import { useNavigate } from "react-router-dom";
import { Badge } from "react-bootstrap";
import ListItem from "../components/ListItem";
import "./ListView.css";

import { useTopicListStore } from "../stores/topic";

const ListView = ({ activeKey, handleTabSelect }) => {
  const navigate = useNavigate();
  const { topicList } = useTopicListStore();

  const handleClick = (e) => {
    e.preventDefault();
    if (activeKey === "favorites" || activeKey === "my-favorites") {
      // Giữ nguyên tab favorites, không làm gì thêm
      navigate("/favorites"); // Hoặc không chuyển hướng, chỉ thông báo
    } else if (activeKey === "my-topics") {
      // Giữ nguyên tab My Topics
      navigate("/my-topics"); // Hoặc không chuyển hướng
    } else {
      // Nếu không phải các tab trên, chuyển hướng về 'all'
      handleTabSelect("all");
    }
  };

  return (
    <div className="topicList list-group">
      {topicList.length ? (
        topicList.map((item) => <ListItem key={item?.slug} topic={item} />)
      ) : (
        <div className="py-4 text-muted">
          {["favorites", "my-favorites"].includes(activeKey) && (
            <>
              Nothing yet... You can find some topics that interest you{" "}
              <a href="" onClick={handleClick}>
                HERE
              </a>
              .
            </>
          )}
          {["all", "my-topics", "topics"].includes(activeKey) && (
            <>
              Nothing yet... You can initiate a new topic{" "}
              <a href="/topic/initiate">HERE</a>.
            </>
          )}
          {activeKey.indexOf("tag") === 0 && (
            <>
              Nothing yet... You can initiate a new topic with{" "}
              <Badge bg="success">{activeKey.substring(3)}</Badge>{" "}
              <a href="/topic/initiate">HERE</a>.
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ListView;
