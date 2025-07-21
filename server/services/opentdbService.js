const axios = require('axios');

const fetchOpenTDBQuestions = async (amount = 10, category, difficulty, type) => {
  let url = `https://opentdb.com/api.php?amount=${amount}`;
  if (category) url += `&category=${category}`;
  if (difficulty) url += `&difficulty=${difficulty}`;
  if (type) url += `&type=${type}`;

  const response = await axios.get(url);
  return response.data.results;
};

module.exports = { fetchOpenTDBQuestions }; 