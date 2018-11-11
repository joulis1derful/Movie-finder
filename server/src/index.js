const express = require('express')
const app = express()

const APP_PORT = 3000

app.use('/', (req, res, next) => {
    console.log('y1')
    next()
})

app.get('/movie/:id', (req, res) => {
    res.send(req.params.id)
})  

app.listen(APP_PORT, () => {
    console.log('Server is listening on port ' + APP_PORT)
})