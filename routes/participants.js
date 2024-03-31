const express = require('express');
const router = express.Router();
const mysql = require('mysql');

// MySQL Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database'
});

router.get('/signup', (req, res) => {
  res.render('participant');
});

router.post('/signup', (req, res) => {
  // Insert participant data into database
});

router.get('/login', (req, res) => {
  res.render('participant_login');
});

router.post('/login', (req, res) => {
  // Validate participant login
});

module.exports = router;
