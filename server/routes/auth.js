const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const mongoose = require('mongoose');
const User = require('../models/User');


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
    const { uid, email, displayName } = req.body;
    try {
      if (req.user.uid !== uid) {
        return res.status(403).json({ error: 'Forbidden: UID mismatch' });
      }
      const isAdmin = email === 'admin@example.com'; // Set admin for specific email
      const user = await User.findOneAndUpdate(
        { uid },
        { uid, email, displayName, isAdmin, createdAt: new Date() },
        { upsert: true, new: true }
      );
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

router.post('/login', async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ error: 'No ID token provided' });
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    // Optionally, find or create the user in your DB here
    res.json({ uid: decodedToken.uid, email: decodedToken.email });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

module.exports = router;