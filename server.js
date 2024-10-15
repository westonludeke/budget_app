// Load environment variables
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const path = require('path'); // Added to use path module
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require('./routes/uploadRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const Transaction = require('./models/Transaction'); // Added to use Transaction model
const { isAuthenticated } = require('./routes/middleware/authMiddleware'); // Ensure isAuthenticated is defined

if (!process.env.DATABASE_URL || !process.env.SESSION_SECRET) {
  console.error("Error: config environment variables not set. Please create/edit .env configuration file.");
  process.exit(-1);
}

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setting the templating engine to EJS
app.set("view engine", "ejs");

// Serve static files
app.use(express.static("public"));

// Database connection
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

// Session configuration with connect-mongo
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

// Logging session creation and destruction
app.use((req, res, next) => {
  const sess = req.session;
  // Make session available to all views
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

// Authentication Routes
app.use(authRoutes);

// Upload Routes
app.use(uploadRoutes);

// Transaction Routes
app.use('/transactions', transactionRoutes);

app.get("/", isAuthenticated, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find()
      .sort({ closeDate: -1 })
      .skip(skip)
      .limit(limit);

    // Group transactions by closeDate
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
      // If it's an AJAX request, render only the main content
      return res.render("partials/_transactionList", {
        transactions,
        currentPage: page,
        totalPages,
        totalTransactions
      });
    }

    res.render("index", {
      user: req.user,
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

// If no routes handled the request, it's a 404
app.use((req, res, next) => {
  res.status(404).send("Page not found.");
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`Unhandled application error: ${err.message}`);
  console.error(err.stack);
  res.status(500).send("There was an error serving your request.");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});