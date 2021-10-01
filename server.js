require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const dns = require("dns");
const urlparsed = require("url");
const mongoose = require("mongoose");
const {Schema} = require("mongoose");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// To connect url to app via mongoose
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

// To create schema for database for that first require {Scema} from monhoose module
const UrlSchema = new Schema({
  original_url: {type: String, require: true},
  short_url: Number
});

// Now creating model in database of this schema

let Url_data = mongoose.model("Url_data", UrlSchema);

// Creating first instance in databasse
let UrlNew = new Url_data({
  original_url: "https://www.example.com",
  short_url: 1
});

// To save first instance
//UrlNew.save();


/*
// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
*/
let urlResult, message1 = "";

// To get url from input tag
app.use(bodyParser.urlencoded({extended: false}));

let indexOfShortUrl;

// To check url validity as "http://www.example.com"
app.post("/api/shorturl", (req, res)=>{
  urlResult = req.body.url;
  // If there is https:// or http:// is present at start of url
  if((/^http(s)?:\/\//).test(urlResult)){
    let result = dns.lookup(urlparsed.parse(urlResult).hostname, (err, address, family)=>{
      // If valid url hostname is given in box
      if(address){
        Url_data.findOne({original_url: urlResult}, (err, data)=>{
          if(err){
            console.log(err);
          }
          else{
            // If there is same url is not present in database
            if(!data){
              Url_data.find({short_url: {$gte: 0}}, (err, data)=>{
                if(err){
                  console.log(err);
                }
                else{
                  indexOfShortUrl = data[data.length - 1].short_url;
                  indexOfShortUrl += 1;
                  UrlNew = new Url_data({
                    original_url: urlResult,
                    short_url: indexOfShortUrl
                  });
                  UrlNew.save();
                }
                res.json({original_url: urlResult, short_url: indexOfShortUrl});
              });
            }
            // If there is same url is present in database
            else{
              indexOfShortUrl = data.short_url;
              UrlNew = new Url_data({
                original_url: urlResult,
                short_url: indexOfShortUrl
              });
              res.json({original_url: urlResult, short_url: indexOfShortUrl});
            }
          }
        });
      }
      // If invalid url hostname is given in box
      else{
        res.json({error: "Invalid hostname"});
      }
    });
  }
  // If there is https:// or http:// missing in url
  else{
    res.json({error: "Invalid url"});
  }
});

app.get("/api/shorturl/:id", (req, res)=>{
  indexOfShortUrl = req.params.id;
  Url_data.findOne({short_url: indexOfShortUrl}, (err, data)=>{
    if(err){
      res.json({message: "There is no such a short url saved in database"})
    }
    else{
      res.redirect(data.original_url);
      res.end();
    }
  });
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

