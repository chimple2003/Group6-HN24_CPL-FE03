import { useState } from 'react';
import { createStore } from 'hox';
import axios from '../utils/axios';
import { API_PREFIX } from '../constants/setting';
export const [useTopicListStore, TopicListStoreProvider] = createStore((props) => {
  const [topicList, setTopicList] = useState([]);
  const [total, setTotal] = useState(0);
  const [theUser, setTheUser] = useState({});
  const { activeKey = 'all' } = props;

  const fetchTopicList = async (options = {}) => {
    // Destructure với giá trị mặc định
    const {
      tag = '',
      author = '',
      favorited = '',
      limit = 20,
      offset = 0,
    } = options;
  
    try {
      let api = `${API_PREFIX}/articles?limit=${limit}&offset=${offset}`;
  
      // Thêm các tham số query nếu có
      if (tag) {
        api += `&tag=${encodeURIComponent(tag)}`;
      }
      if (author) {
        api += `&author=${encodeURIComponent(author)}`;
      }
      if (favorited) {
        api += `&favorited=${encodeURIComponent(favorited)}`;
      }
  
      const { data = {} } = await axios.get(api);
      const { articles = [], articlesCount = 0 } = data;
  
      // Log để kiểm tra kết quả
      console.log('Fetched Articles:', articles);
      console.log('Total Articles Count:', articlesCount);
  
      setTopicList(articles); // Lưu danh sách bài viết
      setTotal(articlesCount); // Lưu tổng số bài viết
    } catch (err) {
      console.error('fetchTopicList error:', err); // Log lỗi nếu có
    }
  };
  
  

  const updateTopicList = (topic) => {
    const index = topicList.findIndex(item => item._id === topic._id);
    if (index > -1) {
      topicList[index] = topic;
    }
    setTopicList([...topicList]);
  };

  const removeTopicFromList = (topic) => {
    const index = topicList.findIndex(item => item._id === topic._id);
    if (index > -1) {
      topicList.splice(index, 1);
    }
    setTopicList([...topicList]);
    setTotal(total - 1);
  };

  return { fetchTopicList, removeTopicFromList, theUser, topicList, total, updateTopicList };
});
