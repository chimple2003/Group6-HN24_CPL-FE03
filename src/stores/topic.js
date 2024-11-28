import { useState } from "react";
import { createStore } from "hox";
import axios from "../utils/axios";
import { API_PREFIX } from "../constants/setting";

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
    const fetchTopicList = async (options = {}) => {
      const {
        tag = "",
        author = "",
        favorited = "",
        page = 1,
        limit = itemsPerPage,
      } = options;

      setLoading(true); // Bắt đầu tải
      setError(null); // Reset lỗi trước khi tải

      try {
        const offset = (page - 1) * limit;
        let api = `${API_PREFIX}/articles?limit=${limit}&offset=${offset}`;

        if (tag) api += `&tag=${encodeURIComponent(tag)}`;
        if (author) api += `&author=${encodeURIComponent(author)}`;
        if (favorited) api += `&favorited=${encodeURIComponent(favorited)}`;

        const { data = {} } = await axios.get(api);
        const { articles = [], articlesCount = 0 } = data;

        setTopicList(articles); // Cập nhật danh sách bài viết
        setTotal(articlesCount); // Cập nhật tổng số bài viết
        setCurrentPage(page); // Cập nhật trang hiện tại
      } catch (err) {
        setError("Failed to fetch topics. Please try again."); // Xử lý lỗi
        console.error("fetchTopicList error:", err);
      } finally {
        setLoading(false); // Kết thúc tải
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
