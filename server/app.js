const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const admin = require('firebase-admin');
const serviceAccount = require('./eduwise-962f3-firebase-adminsdk-fbsvc-46bc61b121.json');
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
require('dotenv').config();
const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://eduwise-d120.onrender.com',
  'https://eduwise-1-s0ex.onrender.com'
];

app.use((req, res, next) => {
  console.log('CORS middleware ran for:', req.method, req.path);
  next();
});

app.options('/api/auth/login', (req, res) => {
  res.send('CORS preflight OK');
});

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors({
  origin: true,
  credentials: true,
}));
app.options('*', cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const userRoutes = require('./routes/user');

app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/users', userRoutes);

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const PORT = process.env.PORT;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));