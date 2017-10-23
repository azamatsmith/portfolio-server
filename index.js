const express = require('express')
const getBooks = require('./Books');
const app = express()

app.get('/', (req, res) => {
  getBooks(result => res.json(result));
})

app.listen(3000, function () {
  console.log('tw-portfolio app listening on port 3000')
})

