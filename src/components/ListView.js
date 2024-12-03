import { useNavigate } from "react-router-dom";
import { Badge } from "react-bootstrap";
import ListItem from "../components/ListItem";
import "./ListView.css";

import { useTopicListStore } from "../stores/topic";

const ListView = ({ activeKey, handleTabSelect }) => {
  const navigate = useNavigate();
  const { topicList, error, loading } = useTopicListStore();

  const renderEmptyMessage = () => {
    if (activeKey === "your-feed") {
      return (
        <div className="py-4 text-muted">
          Your Feed is empty. Start following other users to see their posts.{" "}
          <a
            href="/?tab=global-feed"
            onClick={() => handleTabSelect("global-feed")}
          >
            Browse Global Feed
          </a>
        </div>
      );
    }

    if (activeKey === "global-feed") {
      return (
        <div className="py-4 text-muted">
          Global Feed is empty. Be the first to create a topic{" "}
          <a href="/topic/initiate">HERE</a>.
        </div>
      );
    }

    if (activeKey.startsWith("tag-")) {
      return (
        <div className="py-4 text-muted">
          No topics found for tag{" "}
          <Badge bg="success">{activeKey.substring(4)}</Badge>. Start a topic{" "}
          <a href="/topic/initiate">HERE</a>.
        </div>
      );
    }

    return (
      <div className="py-4 text-muted">
        No topics found. Start a topic <a href="/topic/initiate">HERE</a>.
      </div>
    );
  };

  return (
    <div className="topicList list-group">
      {loading && <div className="text-center py-4">Loading...</div>}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && topicList.length === 0
        ? renderEmptyMessage()
        : topicList.map((item) => <ListItem key={item?.slug} topic={item} />)}
    </div>
  );
};

export default ListView;
