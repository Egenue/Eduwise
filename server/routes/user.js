const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const mongoose = require('mongoose');

const User = mongoose.model('User');

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

router.get('/:uid', verifyToken, async (req, res) => {
  const { uid } = req.params;
  if (req.user.uid !== uid) {
    return res.status(403).json({ error: 'Forbidden: UID mismatch' });
  }
  try {
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;