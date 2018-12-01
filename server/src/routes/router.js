const express = require('express')
const processor = require('../business/processor')
const auth = require('../middleware/auth')
const bodyParser = require('body-parser')

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET

router.post('/register', bodyParser.json(), bodyParser.urlencoded({ extended: false }), (req, res, next) => auth.createToken(req, res, next))
router.use('/login', (req, res, next) => { auth.checkToken(req, res, next) })

router.get('/login', (req, res) => {
    res.redirect(`/profile/${res.userId}`)
})

router.get('/profile/:id', (req, res) => {
    res.json(`My profile ID is ${req.params.id}`)
})

router.get('/movies/top', async (req, res, next) => {
    const movies = await processor.getTopMovies()(req, res, next)
    res.json(movies)
})

router.get('/movies/search', async (req, res, next) => {
    const { name } = req.query
    if (!name) {
        const error = new Error('Invalid movie name was passed in')
        error.status = 403
        next(error)
    } else {
        const movies = await processor.findMovieByName(name)(req, res)
        res.json(movies)
    }
})

router.get('/movies/:id', async (req, res, next) => {
    const { id } = req.params
    const regexp = /^\d+$/
    if (id && regexp.test(id)) {
        const movie = await processor.findMovieById(id)(req, res)
        res.json(movie)
    } else {
        const error = new Error('Invalid movie id was passed in')
        error.status = 403
        next(error)
    }  
})

router.use((err, req, res, next) => {
    res.status(err.status || 500).json(err.message)
})

module.exports = router