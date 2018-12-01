const dotenv = require("dotenv").config()
const router = require('./routes/router')
const express = require('express')
const cors = require('cors')

const APP_PORT = process.env.PORT || 3000

const app = express()
app.use(cors(), router)
 
app.listen(APP_PORT, () => {
    console.log('Server is listening on port ' + APP_PORT)
})

