const config = require('./shared/config')
const routes = require('./routes')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const APP_PORT = config('APP_PORT')

const app = express()
app.use(cors({ exposedHeaders: 'Authorization' }))
app.use(routes.setupRoutes)
app.use(bodyParser.json(), bodyParser.urlencoded({ extended: false }))
 
app.listen(APP_PORT, () => {
	console.log('Server is listening on port ' + APP_PORT)
})

