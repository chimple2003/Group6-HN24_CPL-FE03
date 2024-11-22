import { useState } from 'react';
import { createStore } from 'hox';
import axios from '../utils/axios';
import { API_PREFIX } from '../constants/setting';
export const [useTopicListStore, TopicListStoreProvider] = createStore((props) => {
  const [topicList, setTopicList] = useState([]);
  const [total, setTotal] = useState(0);
  const [theUser, setTheUser] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Số items trên mỗi trang

  const { activeKey = 'all' } = props;

const fetchTopicList = async (options = {}) => {
    const {
      tag = '',
      author = '',
      favorited = '',
      page = 1,
      limit = itemsPerPage,
    } = options;
    
    try {
      const offset = (page - 1) * limit;
      let api = `${API_PREFIX}/articles?limit=${limit}&offset=${offset}`;
      
      if (tag) api += `&tag=${encodeURIComponent(tag)}`;
      if (author) api += `&author=${encodeURIComponent(author)}`;
      if (favorited) api += `&favorited=${encodeURIComponent(favorited)}`;
      
      const { data = {} } = await axios.get(api);
      const { articles = [], articlesCount = 0 } = data;
      
      setTopicList(articles);
      console.log(articles);
      
      setTotal(articlesCount);
      setCurrentPage(page);
    } catch (err) {
      console.error('fetchTopicList error:', err);
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

  return { fetchTopicList, removeTopicFromList, theUser, topicList, total, updateTopicList,currentPage,
    itemsPerPage, };
});
