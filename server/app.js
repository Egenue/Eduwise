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

const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const userRoutes = require('./routes/user');

app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/users', userRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });


const corsOptions = {
  origin: ['http://localhost:3000', 'https://eduwise-d120.onrender.com'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));


// app.use((err, req, res, next) => {
//   console.error('Server error:', err);
//   res.status(500).json({ error: 'Internal server error' });
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));