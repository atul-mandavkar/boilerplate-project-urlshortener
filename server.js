require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const dns = require("dns");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

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
let urlResult;

// To get url from input tag
app.use(bodyParser.urlencoded({extended: false}));

// To check url validity as "http://www.example.com"
function checkValidity(arg){
  let newUrl;
  try{
    newUrl = new URL(arg);
  }
  catch{
    return false;
  }
  console.log(newUrl.host);
  if((/^http(s)?:\/\//).test(arg)){
    let fHost1 = newUrl.host;
    console.log(fHost1.includes("www."));
    console.log(fHost1.includes(".com"));
    console.log(fHost1.includes(".co."));
    console.log(fHost1.match(/\w+\./g));
    console.log(fHost1.match(/\w+\./g).length);
    console.log((/^.\w+/g).test(fHost1));
    console.log(fHost1.match(/^.\w+/g));
    return true;
   }
}

app.post("/api/shorturl", (req, res)=>{
  console.log();
  urlResult = req.body.url;
  if(checkValidity(urlResult)){
    console.log("There is a website");
    /*const  domain = new URL(urlResult);
    console.log(domain.hostname);
    // To check url's hostname and address
    dns.lookup(domain.hostname, (err, address, family)=>{
      console.log(family);
      console.log(address);
    });*/
    res.json({original_url: req.body.url});
  }
  else{
    console.log("There is no such website");
    res.json({error: "Invalid url"});
  }
});



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

