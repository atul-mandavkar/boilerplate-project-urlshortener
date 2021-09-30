require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const dns = require("dns");
const urlparsed = require("url");
const mongoose = require("mongoose");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// To connect url to app via mongoose
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

/*
// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
*/
let urlResult, message1 = "";

// To get url from input tag
app.use(bodyParser.urlencoded({extended: false}));

// To check url validity as "http://www.example.com"

app.post("/api/shorturl", (req, res)=>{
  console.log();
  urlResult = req.body.url;
  if((/^http(s)?:\/\//).test(urlResult)){
    let result = dns.lookup(urlparsed.parse(urlResult).hostname, (err, address, family)=>{
      if(address){
        res.json({original_url: urlResult});
      }
      else{
        res.json({error: "Invalid hostname"});
      }
    });
  }
  else{
    res.json({error: "Invalid url"});
  }
});



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

