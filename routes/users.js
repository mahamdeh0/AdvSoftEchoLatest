
const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../middlewear/mySqlConnect');
const router = express.Router();

//test
router.post('/signup', async (req, res) => {
  try {
    const { username, password, concerns } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (username, password, concerns) VALUES (?, ?, ?)';

    pool.query(query, [username, hashedPassword, concerns], (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.status(201).json({ message: 'User created successfully', userId: results.insertId });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ?';

    pool.query(query, [username], async (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (results.length > 0) {
        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
          res.status(200).json({ message: 'Signed in successfully', userId: user.id });
        } else {
          res.status(401).json({ error: 'Invalid credentials' });
        }
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;

router.post('/find-users', async (req, res) => {
  try {
    const { concerns } = req.body; 

    const concernsArray = concerns.split(',').map(concern => concern.trim());

    let query = 'SELECT * FROM users WHERE';

    const queryConditions = concernsArray.map(concern => ` FIND_IN_SET('${concern}', concerns)`);
    query += queryConditions.join(' OR ');

    pool.query(query, (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.status(200).json({ matchingUsers: results });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/set-alerts', async (req, res) => {
  try {
    const { userId, dataType, thresholdValue, location, thresholdCondition } = req.body;

    const query = 'REPLACE INTO user_alerts (userId, dataType, thresholdValue, location, thresholdCondition) VALUES (?, ?, ?, ?, ?)';

    pool.query(query, [userId, dataType, thresholdValue, location, thresholdCondition], (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.status(201).json({ message: 'Alert preferences set successfully' });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post('/rate-user', async (req, res) => {
  const { ratedUserId, rating } = req.body;

  const insertQuery = 'INSERT INTO userRatings ( ratedUserId, rating) VALUES ( ?, ?)';

  pool.query(insertQuery, [ ratedUserId, rating], (insertError, insertResults) => {
    if (insertError) {
      return res.status(500).json({ error: insertError.message });
    }

    const avgQuery = 'SELECT AVG(rating) as averageRating FROM userRatings WHERE ratedUserId = ?';

    pool.query(avgQuery, [ratedUserId], (avgError, avgResults) => {
      if (avgError) {
        return res.status(500).json({ error: avgError.message });
      }

      const newAverageRating = avgResults[0].averageRating;

     
      const updateQuery = 'UPDATE users SET averageRating = ? WHERE id = ?';

      pool.query(updateQuery, [newAverageRating, ratedUserId], (updateError, updateResults) => {
        if (updateError) {
          return res.status(500).json({ error: updateError.message });
        }

        res.status(201).send('Rating submitted and average rating updated successfully.');
      });
    });
  });
});

module.exports = router;
