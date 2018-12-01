const express = require('express');
const processor = require('../business/processor')
const router = express.Router();

router.use('/', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    console.log('y1')
    next()
})

router.get('/movies/top', async (req, res) => {
    const movies = await processor.getTopMovies()
    res.json(movies)
})

router.get('/movies/recent', (req, res) => {
    res.send('Recent')
})

router.get('/movies/search', async (req, res, next) => {
    if (!req.query.name) {
        const error = new Error('Invalid movie name was passed in')
        error.status = 403
        next(error)
    } else {
        const movies = await processor.findMovieByName(req.query.name)
        res.json(movies)
    }
})

router.get('/movies/:id', async (req, res, next) => {
    const regexp = /\d+/
    if (req.params.id && regexp.test(req.params.id)) {
        const movie = await processor.findMovieById(req.params.id)
        res.json(movie)
    } else {
        const error = new Error('Invalid movie id was passed in')
        error.status = 403
        next(error)
    }  
})

router.use((err, req, res, next) => {
    res.status(err.status || 500)
       .json({ message: err.message, code: err.status })
})

module.exports = router