'use strict'
require('dotenv').config();
let express = require("express");
let app = express();
let PORT = 8080;
let collection; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
var methodOverride = require('method-override');
app.use(methodOverride('_method'));
const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = process.env.MONGODB_URI;



function generateRandomString() {
  var text = "";
  var charset = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for( var i=0; i < 7; i++ )
    text += charset.charAt(Math.floor(Math.random() * charset.length));
    return text;
}

let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    console.log('Could not connect! Unexpected error. Details below.');
    throw err;
  }
  collection = db.collection('urls');
});





app.set('view engine','ejs')

app.get("/", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  collection.find().toArray((err, url) => {
    res.render("urls_index", {url: url});
  });
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post('/urls', (req, res) => {
  var newString = generateRandomString();
  collection.insert({
    shortURL: newString,
    longURL: req.body.thisinput
  });
  res.redirect(`http://localhost:8080/urls/${newString}`);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/urls/:id", (req, res) => {
  console.log(req.params)
  collection.findOne({shortURL: req.params.id}, (err, url) => {
    console.log(url)
    res.render("urls_show", {shortURL: req.params.id});
  })
});

app.delete("/urls/:id",(req, res) => {
  collection.remove({shortURL: req.params.id});
  res.redirect("/urls");
});

app.put("/urls/:id", (req, res) => {
  collection.updateOne({ shortURL: req.params.id}, {
    shortURL: req.params.id,
    longURL: req.body.thisinput
  });
  res.redirect("/urls")
});

app.listen(PORT)
console.log(`${PORT} is the magic port`);

