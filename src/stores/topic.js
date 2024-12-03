import { useState } from "react";
import { createStore } from "hox";
import axios from "../utils/axios";
import { API_PREFIX, BASE_URL } from "../constants/setting";
import { getAcountStore } from "./auth";
export const [useTopicListStore, TopicListStoreProvider] = createStore(
  (props) => {
    const [allTopics, setAllTopics] = useState([]); // Full list of topics
    const [topicList, setTopicList] = useState([]); // Paginated list of topics
    const [total, setTotal] = useState(0); // Total number of topics
    const [theUser, setTheUser] = useState({}); // Current user
    const [currentPage, setCurrentPage] = useState(1); // Current page
    const [loading, setLoading] = useState(false); // Loading status
    const [error, setError] = useState(null); // Error status
    const itemsPerPage = 10; // Number of items per page
    const { activeKey = "all" } = props; // Current tab
    const token = getAcountStore().getToken;
    // Function to fetch topics with a limit of 100
    const fetchTopicList = async ({
      tag = "",
      author = "",
      favorited = "",
      limit = 100,
      page = 1,
      auth = false,
    } = {}) => {
      try {
        setLoading(true);
        const url = `${BASE_URL}/api/articles`;
        const params = new URLSearchParams();

        // Thêm các tham số nếu có
        if (tag) params.append("tag", tag);
        if (author) params.append("author", author);
        if (favorited) params.append("favorited", favorited);
        params.append("limit", limit);

        const headers = {};
        if (auth && token) {
          // Nếu cần Auth và có token
          headers.Authorization = `Token ${token}`;
        }

        // Gửi yêu cầu đến API
        const response = await axios.get(`${url}?${params.toString()}`, {
          headers,
        });

        // Lưu danh sách tất cả các topic
        const articles = response.data.articles || [];
        setAllTopics(articles);
        setTotal(articles.length);

        // Phân trang client-side
        const itemsPerPage = 5; // Số bài viết mỗi trang
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setTopicList(articles.slice(startIndex, endIndex));
        setCurrentPage(page);
      } catch (err) {
        console.error("Failed to fetch topics:", err);
        setError("Failed to fetch topics");
      } finally {
        setLoading(false);
      }
    };

    const getArticlesFeed = async ({ page = 1 } = {}) => {
      try {
        setLoading(true);

        // Lấy token từ auth store
        const token = getAcountStore().getToken();
        if (!token) {
          throw new Error("User not authenticated");
        }

        const url = `${BASE_URL}/api/articles/feed`;
        const params = new URLSearchParams();

        // Thêm các tham số phân trang
        params.append("limit", itemsPerPage);
        params.append("offset", (page - 1) * itemsPerPage);

        // Gửi request với header Authorization
        const response = await axios.get(`${url}?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Lưu trữ danh sách bài viết và tổng số bài viết
        setTopicList(response.data.articles);
        setTotal(response.data.articlesCount || 0);
        setCurrentPage(page);
      } catch (err) {
        console.error("Failed to fetch articles feed:", err);
        setError("Failed to fetch articles feed");
      } finally {
        setLoading(false);
      }
    };

    // Update topic in the list
    const updateTopicList = (updatedTopic) => {
      // Update in full list
      const updatedAllTopics = allTopics.map((topic) =>
        topic.slug === updatedTopic.slug ? updatedTopic : topic
      );
      setAllTopics(updatedAllTopics);

      // Update in current page list
      setTopicList((prevList) =>
        prevList.map((topic) =>
          topic.slug === updatedTopic.slug ? updatedTopic : topic
        )
      );
    };

    // Remove topic from list
    const removeTopicFromList = (topic) => {
      // Remove from full list
      const updatedAllTopics = allTopics.filter(
        (item) => item._id !== topic._id
      );
      setAllTopics(updatedAllTopics);

      // Remove from current page list
      setTopicList((prevList) =>
        prevList.filter((item) => item._id !== topic._id)
      );

      setTotal((prevTotal) => prevTotal - 1);
    };

    return {
      fetchTopicList, // Function to fetch topics
      removeTopicFromList, // Function to remove topic
      theUser, // Current user
      topicList, // Paginated list of topics
      allTopics, // Full list of topics
      total, // Total number of topics
      updateTopicList, // Function to update topic
      currentPage, // Current page
      itemsPerPage, // Items per page
      loading, // Loading status
      error, // Error status
      activeKey,
      getArticlesFeed,
    };
  }
);
