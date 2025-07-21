const axios = require('axios');

const fetchOpenTDBQuestions = async ({ amount = 10, category, difficulty, type }) => {
  try {
    const url = new URL('https://opentdb.com/api.php');
    url.searchParams.append('amount', amount);
    if (category) url.searchParams.append('category', category);
    if (difficulty) url.searchParams.append('difficulty', difficulty);
    if (type) url.searchParams.append('type', type);

    const response = await axios.get(url.toString());
    if (response.data.response_code !== 0) {
      throw new Error('Failed to fetch questions from OpenTDB');
    }
    return response.data.results.map(q => ({
      questionText: q.question,
      options: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
      correctAnswer: q.correct_answer,
    }));
  } catch (error) {
    throw new Error(`OpenTDB API error: ${error.message}`);
  }
};

module.exports = { fetchOpenTDBQuestions };