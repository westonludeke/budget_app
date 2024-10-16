const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const { parse } = require('csv-parse');
const Transaction = require('../models/Transaction');
const { isAuthenticated } = require('./middleware/authMiddleware');

const upload = multer({ dest: 'uploads/' });

router.get('/upload', isAuthenticated, (req, res) => {
  res.render('upload', { session: req.session });
});

router.post('/upload', isAuthenticated, upload.single('csvFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(parse({ columns: true, trim: true }))
    .on('data', (data) => {
      results.push(data);
    })
    .on('end', async () => {
      try {
        for (const row of results) {
          const transaction = new Transaction({
            postDate: new Date(row['Post Date']),
            transactionDate: new Date(row['Transaction Date']),
            referenceNumber: row['Reference Number'],
            merchantData: row['Merchant Data'],
            amount: parseFloat(row['Dollar Amount'].replace('$', '').trim()),
            closeDate: '', // Initialize with an empty string
            category: '' // Initialize with an empty string
          });
          await transaction.save();
        }
        fs.unlinkSync(req.file.path); // Delete the uploaded file after processing
        res.redirect('/'); // Redirect to homepage after successful upload
      } catch (error) {
        console.error('Error saving transactions:', error);
        console.error(error.stack);
        res.status(500).send('Error processing file');
      }
    });
});

module.exports = router;