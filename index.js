const express = require('express');
const mysql = require('mysql');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
// app.use( bodyParser.json({limit: '10mb', extended: true}) ); 
// app.use(bodyParser.urlencoded({ extended: false }));

// create connection
const con = mysql.createConnection({
  host: "remotemysql.com",
  user: "r3AHiWjIhC",
  password: "NC35oj5Kyu",
  database: "r3AHiWjIhC"
});
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Put all API endpoints under '/api'
app.get('/users', (req, res) => {
  // get all usernames
  con.query('select * from User', function (err, result) {
    if (err) throw err;
    console.log("Result: " + result);
    res.json(result);
  });
});


// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Demo App ${port}`);
