const config = require('./shared/config')
const router = require('./routes/router')
const express = require('express')
const cors = require('cors')

const APP_PORT = config('APP_PORT')

const app = express()
app.use(cors(), router)
 
app.listen(APP_PORT, () => {
	console.log('Server is listening on port ' + APP_PORT)
})

