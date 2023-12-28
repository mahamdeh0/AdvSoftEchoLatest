
const express = require('express');
const router = express.Router();
const pool = require('../middlewear/mySqlConnect');
router.post('/new', async (req, res) => {
  const { userId, dataType, value, timestamp, location } = req.body;

  const insertQuery = 'INSERT INTO environmentaldata (userId, dataType, value, timestamp, location) VALUES (?, ?, ?, ?, ?)';

  pool.query(insertQuery, [userId, dataType, value, timestamp, location], (error, insertResults) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const updateRatingQuery = 'UPDATE users SET score = score + 1 WHERE id = ?';

    pool.query(updateRatingQuery, [userId], (updateError, updateResults) => {
      if (updateError) {
        return res.status(500).json({ error: updateError.message });
      }
      if (updateResults.affectedRows === 0) {
        return res.status(404).send('User not found.');
      }

      res.status(201).send('Environmental data submitted and user rating updated successfully.');
    });
  });
});
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  const query = 'SELECT * FROM environmentaldata WHERE userId = ?';

  pool.query(query, [userId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json({ data: results });
  });
});

router.put('/:dataId', async (req, res) => { 
  const { dataId } = req.params;
  const { newValue } = req.body; 
  const query = 'UPDATE environmentaldata SET value = ? WHERE userId = ?';

  pool.query(query, [newValue, dataId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).send('No data found with the provided ID.');
    }
    res.status(200).send('Data updated successfully.');
  });

});

module.exports = router;
