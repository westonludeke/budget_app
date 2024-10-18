const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const Transaction = require('../models/Transaction');
const router = express.Router();

router.get('/auth/register', (req, res) => {
  res.render('register');
});

router.post('/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    // User model will automatically hash the password using bcrypt
    await User.create({ username, password });
    res.redirect('/auth/login');
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send(error.message);
  }
});

router.get('/auth/login', (req, res) => {
  res.render('login');
});

router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      req.session.userId = user._id;
      return res.redirect('/');
    } else {
      return res.status(400).send('Password is incorrect');
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).send(error.message);
  }
});

router.get('/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error during session destruction:', err);
      return res.status(500).send('Error logging out');
    }
    res.redirect('/auth/login');
  });
});

router.get('/', async (req, res) => {
  try {
    let user = null;
    if (req.session && req.session.userId) {
      user = await User.findById(req.session.userId);
    }

    // Fetch all transactions
    const transactions = await Transaction.find().sort({ closeDate: -1 });

    // Group transactions by closeDate
    const transactionGroups = transactions.reduce((groups, transaction) => {
      const closeDate = transaction.closeDate || 'No Date';
      if (!groups[closeDate]) {
        groups[closeDate] = [];
      }
      groups[closeDate].push(transaction);
      return groups;
    }, {});

    // Convert to array of [closeDate, transactions] pairs
    const groupedTransactions = Object.entries(transactionGroups);

    res.render('index', { user: user, transactionGroups: groupedTransactions });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('An error occurred');
  }
});

module.exports = router;