const processor = require('./business/processor')

const express = require('express')
const app = express()

const APP_PORT = 3000

app.use('/', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    console.log('y1')
    next()
})

app.get('/movies/top', (req, res) => {
    res.send('TOP movies')
})

app.get('/movies/recent', (req, res) => {
    res.send('Recent')
})

app.get('/movies/search', async (req, res) => {
    if (!req.query.name) {
        res.sendStatus(403)
    } else {
        const movies = await processor.findMovieByName(req.query.name)
        res.json(movies)
    }
})

app.get('/movies/:id', async (req, res) => {
        const movie = await processor.findMovieById(req.params.id)
        res.json(movie)
})

app.listen(APP_PORT, () => {
    console.log('Server is listening on port ' + APP_PORT)
})