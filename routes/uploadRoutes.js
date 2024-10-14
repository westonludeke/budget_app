const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('./middleware/authMiddleware');

router.get('/upload', isAuthenticated, (req, res) => {
  res.render('upload');
});

module.exports = router;