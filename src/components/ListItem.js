import { useNavigate, useSearchParams } from "react-router-dom";
import { Badge, Button } from "react-bootstrap";
import { useAcountStore, useLoadingStore } from "../stores/auth";
import { useTopicListStore } from "../stores/topic";
import axios from "../utils/axios";

const ListItem = ({ topic }) => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "all";
  const { user = {} } = useAcountStore();
  const { updateTopicList } = useTopicListStore();
  const navigate = useNavigate();
  const handleFavorite = async () => {
    console.log("User before favorite:", localStorage.getItem("user"));

    if (!user?.username) {
      alert("Please log in to favorite articles.");
      return;
    }
    console.log(topic.slug);
    try {
      const token = localStorage.getItem("token"); // L?y token t? localStorage
      if (!token) {
        alert("Token not found. Please log in again.");
        return;
      }

      const apiUrl = `/articles/${topic.slug}/favorite`;
      const method = topic.favorited ? "delete" : "post";
      const config = {
        method,

        url: `https://node-express-conduit.appspot.com/api${apiUrl}`, // API URL d?y d?
        headers: {
          Authorization: `Bearer ${token}`, // Thêm Bearer token vào header
        },
      };

      const response = await axios.request(config); // G?i yêu c?u v?i axios
      const updatedTopic = response.data.article; // D? li?u bài vi?t sau khi yêu thích/b? yêu thích
      updateTopicList(updatedTopic); // C?p nh?t danh sách bài vi?t

      console.log("User after favorite:", localStorage.getItem("user"));
    } catch (error) {
      console.error("Failed to update favorite status:", error);
      if (error.response) {
        // X? lý l?i ph?n h?i t? server
        console.error("Error Response:", error.response.data);
        alert(
          `Error: ${error.response.data.errors?.message || "Unexpected error"}`
        );
      } else {
        // L?i không mong d?i
        console.error("Unexpected Error:", error.message);
      }
    }
  };

  return (
    <div className="d-flex list-group-item list-group-item-action gap-3">
      <a
        className="avatar flex-shrink-0"
        // href={`/profile/${topic.author?.username}`}
        title={topic.author?.bio || topic.author?.username || "Unknown User"}
      >
        <img
          alt={topic.author?.username || "User"}
          height="32"
          src={topic.author?.image || "/path/to/default-avatar.png"}
          width="32"
        />
      </a>

      <div className="w-100">
        <div className="d-flex w-100 justify-content-between mb-2">
          <div className="w-100">
            <a href={`/topic/${topic.slug}`} className="d-block mb-4">
              <h5 className="mb-1">{topic.title}</h5>
              <p className="text-muted">{topic.description}</p>
            </a>
          </div>
          <div className="favorite align-items-end text-end">
            <Button
              variant={topic.favorited ? "danger" : "outline-secondary"}
              size="sm"
              onClick={handleFavorite}
            >
              {topic.favorited ? "? Favorited" : "? Favorite"}
            </Button>
            <small className="d-block text-muted mt-1">
              {topic.favoritesCount} likes
            </small>
          </div>
        </div>
        <div className="d-flex w-100 justify-content-between gap-3 pt-2">
          <small className="d-block flex-shrink-0 text-muted">
            {`Published by ${
              topic.author?.username || "Unknown User"
            } on ${new Date(topic.createdAt).toLocaleDateString()}`}
          </small>
          <div className="w-100 text-end">
            {topic.tagList?.map((tag, i) => (
              <Badge
                as="a"
                bg="success"
                className={i === 0 ? "" : "ms-2"}
                onClick={() => navigate(`/?tab=tag-${tag}&page=1`)}
                key={tag}
              >
                {tag}
              </Badge>
            ))}
          </div>

          <small
            className="updateTime d-block flex-shrink-0 text-muted text-end"
            title={topic.updatedAt}
          >
            {`Updated on ${new Date(topic.updatedAt).toLocaleDateString()}`}
          </small>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
