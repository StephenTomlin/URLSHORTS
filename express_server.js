'use strict'
let express = require("express");
let app = express();
let PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
var methodOverride = require('method-override');
app.use(methodOverride('_method'));
const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = "mongodb://127.0.0.1:27017/url_shortener";



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
app.set('view engine','ejs')

app.get("/", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post('/urls', (req, res) => {
  var newString = generateRandomString()
  urlDatabase[newString] = req.body.longURL;
  res.redirect(`http://localhost:8080/urls/${newString}`);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.get("/urls/:id", (req, res) => {

  MongoClient.connect(MONGODB_URI, (err, db) => {

  if (err) {
    console.log('Could not connect! Unexpected error. Details below.');
    throw err;
  }

  console.log('Connected to the database!');
  let collection = db.collection("urls");

  console.log('Retreiving documents for the "urls" collection...');
  collection.find().toArray((err, results) => {
    console.log('results: ', results);

    console.log('Disconnecting from Mongo!');
    db.close();

  });
});

  res.render("urls_show", { shortURL: req.params.id });
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.delete("/urls/:id",(req, res) => {
  delete urlDatabase[req.params.id]
  res.redirect("/urls")
});

app.put("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL
  res.redirect("/urls")
})

app.listen(PORT)
console.log(`${PORT} is the magic port`);

