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
  res.render('organizer');
});

router.post('/signup', (req, res) => {
  // Insert organizer data into database
});

router.get('/login', (req, res) => {
  res.render('organizer_login');
});

router.post('/login', (req, res) => {
  // Validate organizer login
});

module.exports = router;
