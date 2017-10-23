const express = require('express')
const getBooks = require('./Books');
const app = express()

const port = process.env.PORT || 3005;

// ALLOW CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/', (req, res) => {
  getBooks(result => res.json(result));
})

app.listen(port, () => {
  console.log('tw-portfolio app listening on port ', port)
})

