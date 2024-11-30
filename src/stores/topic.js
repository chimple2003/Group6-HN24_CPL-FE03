import { useState } from "react";
import { createStore } from "hox";
import axios from "../utils/axios";
import { API_PREFIX, BASE_URL } from "../constants/setting";

export const [useTopicListStore, TopicListStoreProvider] = createStore(
  (props) => {
    const [topicList, setTopicList] = useState([]); // Danh sách bài viết
    const [total, setTotal] = useState(0); // Tổng số bài viết
    const [theUser, setTheUser] = useState({}); // Người dùng hiện tại
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [loading, setLoading] = useState(false); // Trạng thái loading
    const [error, setError] = useState(null); // Trạng thái lỗi

    const itemsPerPage = 10; // Số bài viết mỗi trang
    const { activeKey = "all" } = props; // Tab hiện tại

    // Hàm tải danh sách bài viết từ API
    const fetchTopicList = async ({ page, feed = false, tag = "" }) => {
      try {
        let url = `${BASE_URL}/api/articles`;
        const params = new URLSearchParams();

        if (feed) {
          // Gọi API Your Feed
          url = `${BASE_URL}/api/articles/feed`;
        } else if (tag) {
          // Thêm tham số tag nếu có
          params.append("tag", tag);
        }

        params.append("limit", 10);
        params.append("offset", (page - 1) * 10);

        const response = await axios.get(`${url}?${params.toString()}`);
        setTopicList(response.data.articles);
        setTotal(response.data.articlesCount || 0);
      } catch (err) {
        console.error("Failed to fetch topics:", err);
        setError("Failed to fetch topics");
      } finally {
        setLoading(false);
      }
    };

    // Hàm cập nhật thông tin bài viết trong danh sách
    const updateTopicList = (updatedTopic) => {
      setTopicList((prevList) =>
        prevList.map((topic) =>
          topic.slug === updatedTopic.slug ? updatedTopic : topic
        )
      );
    };

    // Hàm xóa bài viết khỏi danh sách
    const removeTopicFromList = (topic) => {
      setTopicList((prevList) =>
        prevList.filter((item) => item._id !== topic._id)
      );
      setTotal((prevTotal) => prevTotal - 1);
    };

    return {
      fetchTopicList, // Hàm tải danh sách bài viết
      removeTopicFromList, // Hàm xóa bài viết
      theUser, // Người dùng hiện tại
      topicList, // Danh sách bài viết
      total, // Tổng số bài viết
      updateTopicList, // Hàm cập nhật bài viết
      currentPage, // Trang hiện tại
      itemsPerPage, // Số bài viết mỗi trang
      loading, // Trạng thái loading
      error, // Trạng thái lỗi
      activeKey,
    };
  }
);
