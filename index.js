const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const generatePassword = require('password-generator');
const fs = require('fs');
const request = require('request');

const app = express();
app.use( bodyParser.json({limit: '10mb', extended: true}) ); 
app.use(bodyParser.urlencoded({ extended: false }));
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Put all API endpoints under '/api'
app.get('/api/passwords', (req, res) => {
  const count = 5;

  // Generate some passwords
  const passwords = Array.from(Array(count).keys()).map(i =>
    generatePassword(12, false)
  )

  // Return them as json
  res.json(passwords);

  console.log(`Sent ${count} passwords`);
});
app.post('/save', function(req, res) {
  const content =   req.body.response;
  const result = content.replace(/https:\/\//g, "/play?url=https://");
  fs.writeFile('./server/data.m3u8', result , function(err) {
    if (err) {
       res.status(500).jsonp({ error: 'Failed to write file' });
    }
    res.send("File write success");
  });
});
app.get('/watch.m3u8', (req, res) => {
  res.setHeader("content-type", "some/type");
  fs.readFile("./server/data.m3u8", 'utf8', function(err, data) {  
    if (err) res.send(err);
    else {
      fs.createReadStream("./server/data.m3u8").pipe(res);
    }
});
});
app.get('/play', function(req,res) {
  const tag = req.query.url;
  const newurl = tag;
  console.log(newurl);
  var newReq = request(newurl, function(error) {
    if (error) {
        logError(error);
    }
  });
  req.pipe(newReq)
      .on('response',
        function (response) {
          res.writeHead(response.statusCode, {
            ...response.headers,
          });
        }
      ).pipe(res);
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Password generator listening on ${port}`);
