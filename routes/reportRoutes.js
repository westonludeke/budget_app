const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('./middleware/authMiddleware');

router.get('/', isAuthenticated, (req, res) => {
  res.render('reports', { title: 'Reports' });
});

module.exports = router;