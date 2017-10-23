const express = require('express')
const getBooks = require('./Books');
const app = express()

app.get('/', (req, res) => {
  getBooks(result => res.json(result));
})

app.listen(3005, function () {
  console.log('Example app listening on port 3005!')
})

