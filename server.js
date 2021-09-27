require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { response } = require('express');
const bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
/*
// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
*/

// To get url from input tag
app.use(bodyParser.urlencoded({extended: true}));

app.post("/api/shorturl", (req, res)=>{
  res.json({value: req.body.url});
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

