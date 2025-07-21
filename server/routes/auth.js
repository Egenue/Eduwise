const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const mongoose = require('mongoose');

// Define User schema
const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  displayName: String,
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model('User', userSchema);

// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (!idToken) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = await admin.auth().verifyIdToken(idToken);
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// Register route
router.post('/register', verifyToken, async (req, res) => {
  const { uid, email, displayName, isAdmin } = req.body;
  try {
    // Verify the token belongs to the same user
    if (req.user.uid !== uid) {
      return res.status(403).json({ error: 'Forbidden: UID mismatch' });
    }

    // Save or update user in MongoDB
    const user = await User.findOneAndUpdate(
      { uid },
      { uid, email, displayName, isAdmin },
      { upsert: true, new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;