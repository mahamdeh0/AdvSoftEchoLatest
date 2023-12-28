const express = require('express');
const router = express.Router();
const pool = require('../middlewear/mySqlConnect');

// Post a new report
router.post('/', async (req, res) => {
  const { userId, header, data } = req.body;
  const query = 'INSERT INTO reports (userId, header, data) VALUES (?, ?, ?)';
  pool.query(query, [userId, header, data], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(201).send('Report created successfully.');
  });
});
//test
// Get reports by user ID
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const query = 'SELECT * FROM reports WHERE userId = ?';
  pool.query(query, [userId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json({ data: results });
  });
});

// Update an existing report
router.put('/:reportId', async (req, res) => {
  const { reportId } = req.params;
  const { newHeader, newData } = req.body;
  const query = 'UPDATE reports SET header = ?, data = ? WHERE id = ?';
  pool.query(query, [newHeader, newData, reportId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).send('No report found with the provided ID.');
    }
    res.status(200).send('Report updated successfully.');
  });
});

module.exports = router;