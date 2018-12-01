const dotenv = require("dotenv").config()
const router = require('./routes/router')
const bodyParser = require('body-parser')
const express = require('express')
const APP_PORT = process.env.PORT || 3000

const app = express()

app.use('/', router)

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
 
app.listen(APP_PORT, () => {
    console.log('Server is listening on port ' + APP_PORT)
})