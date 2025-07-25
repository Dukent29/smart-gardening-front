import axios from './axios';

export const getAllArticles = async () => {
  const res = await axios.get('/articles');
  return res.data; // expected to return { success, articles }
};

