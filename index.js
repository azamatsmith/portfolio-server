const express = require('express');
const bodyParser = require('body-parser');
const books = require('./Books');
const app = express();
const Books = new books();

const port = process.env.PORT || 3005;

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

// ALLOW CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

app.post('/getImage', (req, res) => {
  Books.getImage(req.body.link, link => res.json({link}));
});

app.get('/', (req, res) => {
  Books.getBooks(result => res.json(result));
});

app.listen(port, () => {
  console.log('tw-portfolio app listening on port ', port);
});
