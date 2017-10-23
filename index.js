const express = require('express')
const getBooks = require('./Books');
const app = express()

const port = process.env.PORT || 3005;

app.get('/', (req, res) => {
  getBooks(result => res.json(result));
})

app.listen(port, () => {
  console.log('tw-portfolio app listening on port ', port)
})

