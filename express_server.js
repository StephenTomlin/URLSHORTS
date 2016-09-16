'use strict'
let express = require("express");
let app = express();
let PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
var methodOverride = require('method-override')
app.use(methodOverride('_method'))



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
  res.render("urls_show", { shortURL: req.params.id });
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.end ("<html><body><h1>Hello </h1><b>World</b></body></html>\n");
});

app.delete("/urls/:id",(req, res) => {
  delete urlDatabase[req.params.id]
  res.redirect("/urls")
});

app.put("/urls/:id", (req, res) => {
  console.log(req)
  let newID = generateRandomString();
  if (urlDatabase.hasOwnProperty(req.params.id)) {
    urlDatabase[newID] = urlDatabase[req.params.id];
    delete urlDatabase[req.params.id];
  }
  res.redirect("/urls")
})

app.listen(PORT)
console.log(`${PORT} is the magic port`);

