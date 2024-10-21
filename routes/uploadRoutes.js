const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const { parse } = require('csv-parse');
const Transaction = require('../models/Transaction');
const { isAuthenticated } = require('./middleware/authMiddleware');

const upload = multer({ dest: 'uploads/' });

router.get('/upload', isAuthenticated, (req, res) => {
  res.render('upload');
});

router.post('/upload', isAuthenticated, upload.single('file'), (req, res) => {
  if (!req.file) {
    console.log('No file uploaded');
    return res.status(400).send('No file uploaded.');
  }

  console.log('File uploaded:', req.file.originalname);

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(parse({ columns: true, trim: true }))
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        console.log('CSV parsing completed. Rows:', results.length);

        const transactions = results.map(row => ({
          postDate: new Date(row['Post Date']),
          transactionDate: new Date(row['Transaction Date']),
          referenceNumber: row['Reference Number'],
          merchantData: row['Merchant Data'],
          amount: parseFloat(row['Dollar Amount'].replace('$', '').trim()),
          closeDate: row['Close Date'] ? row['Close Date'] : 'No Date', // Updated default value
          category: row['Category'] ? row['Category'] : '' // Set an empty string as default if not present
        }));

        console.log('Transactions mapped. Count:', transactions.length);

        await Transaction.insertMany(transactions);
        console.log('Transactions saved successfully');

        fs.unlinkSync(req.file.path); // Delete the uploaded file after processing
        res.redirect('/'); // Redirect to homepage after successful upload
      } catch (error) {
        console.error('Error saving transactions:', error);
        res.status(500).send('Error processing file');
      }
    });
});

module.exports = router;