const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('./middleware/authMiddleware');

router.get('/reports', isAuthenticated, (req, res) => {
  res.render('reports');
});

module.exports = router;