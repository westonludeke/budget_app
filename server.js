// Load environment variables
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const path = require('path');
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require('./routes/uploadRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const reportRoutes = require('./routes/reportRoutes');
const Transaction = require('./models/Transaction');
const { isAuthenticated } = require('./routes/middleware/authMiddleware');

if (!process.env.DATABASE_URL || !process.env.SESSION_SECRET) {
  console.error("Error: config environment variables not set. Please create/edit .env configuration file.");
  process.exit(-1);
}

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");

app.use(express.static("public"));

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error(`Database connection error: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
  });

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
  }),
);

app.on("error", (error) => {
  console.error(`Server error: ${error.message}`);
  console.error(error.stack);
});

app.use((req, res, next) => {
  const sess = req.session;
  res.locals.session = sess;
  if (!sess.views) {
    sess.views = 1;
    console.log("Session created at: ", new Date().toISOString());
  } else {
    sess.views++;
    console.log(
      `Session accessed again at: ${new Date().toISOString()}, Views: ${sess.views}, User ID: ${sess.userId || '(unauthenticated)'}`,
    );
  }
  next();
});

// Make user data available to all views
app.use((req, res, next) => {
  res.locals.user = req.session.userId ? { id: req.session.userId, username: req.session.username } : null;
  next();
});

app.use(authRoutes);

app.use(uploadRoutes);

app.use('/transactions', transactionRoutes);

app.use('/reports', reportRoutes);

app.get("/", isAuthenticated, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find()
      .sort({ closeDate: -1 })
      .skip(skip)
      .limit(limit);

    const groupedTransactions = transactions.reduce((acc, transaction) => {
      let closeDate = 'Uncategorized';
      if (transaction.closeDate) {
        closeDate = transaction.closeDate instanceof Date
          ? transaction.closeDate.toISOString().split('T')[0]
          : String(transaction.closeDate);
      }
      if (!acc[closeDate]) {
        acc[closeDate] = {
          transactions: [],
          count: 0,
          total: 0
        };
      }
      acc[closeDate].transactions.push(transaction);
      acc[closeDate].count += 1;
      acc[closeDate].total += transaction.amount;
      return acc;
    }, {});

    const totalTransactions = Object.values(groupedTransactions).reduce((sum, group) => sum + group.count, 0);
    const totalPages = Math.ceil(totalTransactions / limit);

    console.log('Grouped transactions:', JSON.stringify(groupedTransactions, null, 2));

    if (req.xhr) {
      return res.render("partials/_transactionList", {
        transactions,
        currentPage: page,
        totalPages,
        totalTransactions
      });
    }

    res.render("index", {
      user: res.locals.user,
      groupedTransactions: groupedTransactions,
      currentPage: page,
      totalPages,
      totalTransactions
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    console.error(error.stack);
    res.status(500).send('Error fetching transactions');
  }
});

app.use((req, res, next) => {
  res.status(404).send("Page not found.");
});

app.use((err, req, res, next) => {
  console.error(`Unhandled application error: ${err.message}`);
  console.error(err.stack);
  res.status(500).send("There was an error serving your request.");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});