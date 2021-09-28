require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const dns = require("dns");

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
  /*let res = arg.match(/\w+./g);
  console.log(res[0]);
  if(res[0] === "http:" || res[0] === "https:" || res[0] === "ftp:"){
    return true;
  }
  else{
    return false;
  }*/
  let newUrl;
  try{
    newUrl = new URL(arg);
  }
  catch{
    return false;
  }
  console.log("host name : " + newUrl.hostname);
  console.log("path name : " + newUrl.pathname);
  console.log("protocol : " + newUrl.protocol);
  // Next time use xhr method to post url (check availability) from ajax

  return true;
  /*let arr = newUrl.hostname.match(/\w+./g);
  console.log(arr);
  if((arr.length > 2)?(arr[0] === "www."):(true)){
    return true;
  }*/
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

