import { useState } from "react";
import { createStore } from "hox";
import axios from "../utils/axios";
import { API_PREFIX, BASE_URL } from "../constants/setting";

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

    // Function to fetch topics with a limit of 100
    const fetchTopicList = async ({ page = 1, feed = false, tag = "" }) => {
      try {
        setLoading(true);
        let url = `${BASE_URL}/api/articles`;
        const params = new URLSearchParams();

        if (feed) {
          // API call for Your Feed
          url = `${BASE_URL}/api/articles/feed`;
        } else if (tag) {
          // Add tag parameter if present
          params.append("tag", tag);
        }

        // Fetch 100 records
        params.append("limit", 380);
        params.append("offset", 0);

        const response = await axios.get(`${url}?${params.toString()}`);

        // Store full list of topics
        setAllTopics(response.data.articles);
        setTotal(response.data.articlesCount || 0);

        // Paginate topics client-side
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setTopicList(response.data.articles.slice(startIndex, endIndex));
        setCurrentPage(page);
      } catch (err) {
        console.error("Failed to fetch topics:", err);
        setError("Failed to fetch topics");
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
    };
  }
);
