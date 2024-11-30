import { useSearchParams } from "react-router-dom";
import { Badge, Button } from "react-bootstrap";
import { useAcountStore, useLoadingStore } from "../stores/auth";
import { useTopicListStore } from "../stores/topic";
import axios from "../utils/axios";

const ListItem = ({ topic }) => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "all";
  const { user = {} } = useAcountStore();
  const { updateTopicList } = useTopicListStore();

  const handleFavorite = async () => {
    console.log("User before favorite:", localStorage.getItem("user"));

    if (!user?.username) {
      alert("Please log in to favorite articles.");
      return;
    }
    console.log(topic.slug);
    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage
      if (!token) {
        alert("Token not found. Please log in again.");
        return;
      }

      const apiUrl = topic.favorited
        ? `/articles/${topic.slug}/unfavorite`
        : `/articles/${topic.slug}/favorite`;

      const config = {
        method: "post",
        maxBodyLength: Infinity, // Đảm bảo không giới hạn kích thước body
        url: `https://node-express-conduit.appspot.com/api${apiUrl}`, // API URL đầy đủ
        headers: {
          Authorization: `Bearer ${token}`, // Thêm Bearer token vào header
        },
      };

      const response = await axios.request(config); // Gửi yêu cầu với axios
      const updatedTopic = response.data.article; // Dữ liệu bài viết sau khi yêu thích/bỏ yêu thích
      updateTopicList(updatedTopic); // Cập nhật danh sách bài viết

      console.log("User after favorite:", localStorage.getItem("user"));
    } catch (error) {
      console.error("Failed to update favorite status:", error);
      if (error.response) {
        // Xử lý lỗi phản hồi từ server
        console.error("Error Response:", error.response.data);
        alert(
          `Error: ${error.response.data.errors?.message || "Unexpected error"}`
        );
      } else {
        // Lỗi không mong đợi
        console.error("Unexpected Error:", error.message);
      }
    }
  };

  return (
    <div className="d-flex list-group-item list-group-item-action gap-3">
      <a
        className="avatar flex-shrink-0"
        href={`/profile/${topic.author?.username}`}
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
            <a href={`/article/${topic.slug}`} className="d-block mb-4">
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
              {topic.favorited ? "♥ Favorited" : "♡ Favorite"}
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
                href={`/tags/${tag}`}
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
