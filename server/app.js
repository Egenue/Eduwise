const express = require('express');
const admin = require('firebase-admin');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const userRoutes = require('./routes/user');

// Load environment variables
dotenv.config();
if (!process.env.MONGO_URL) {
  console.error('Error: MONGO_URL is not defined in .env file');
  process.exit(1);
}

// Initialize models
// require('./models/index');

const app = express();

const corsOptions = {
  origin: ['http://localhost:3000', 'https://edu-wis-frontend.onrender.com'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// Initialize Firebase Admin
const serviceAccount = require('./eduwise-962f3-firebase-adminsdk-fbsvc-46bc61b121.json');
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));