const express = require('express')
const movieService = require('../service/movie')
const userService = require('../service/user')
const auth = require('../middleware/auth')
const bodyParser = require('body-parser')

const router = express.Router()

router.post('/register', bodyParser.json(), bodyParser.urlencoded({ extended: false }), async (req, res, next) => {
	if (req.body && req.body.email) {
		const user = await userService.getUserByEmail(req.body.email)
		if (!user) {
			const token = await auth.createToken(req, res, next)
			res.set('Authorization', token)
			res.status(200).json({ message: 'You were registered successfully' })
		} else {
			const err = new Error('This user is already registered')
			err.status = 409
			next(err)
		}
	} else {
		const err = new Error('Email is not provided')
		err.status = 403
		next(err)
	}
}) 

router.use('/login', (req, res, next) => { 
	auth.checkToken(req, res, next) 
})

router.post('/login', bodyParser.json(), bodyParser.urlencoded({ extended: false }), async (req, res, next) => {
	if (req.body && req.body.email && req.body.password) {
		const user = await userService.getUserByEmail(req.body.email)
		if (!user) {
			const err = new Error('Cannot find user with this email')
			err.status = 409
			next(err)
		} else if (req.body.password !== user.password) {
			const err = new Error('Invalid password was provided')
			err.status = 409
			next(err)
		} else {
			res.status(200).json({ message: 'Log in succeeded', data: { userId: user.userId } })
		}
	} else {
		const err = new Error('Either no email or password was provided')
		err.status = 403
		next(err)
	}
})

router.get('/profile/:id', (req, res) => {
	res.json(`My profile ID is ${req.params.id}`)
})

router.get('/movies/top', async (req, res, next) => {
	await movieService.getTopMovies(req, res, next)
})

router.get('/movies/search', async (req, res, next) => {
	await movieService.findMovieByName(req, res, next)
})

router.get('/movies/:id', async (req, res, next) => {
	await movieService.findMovieById(req, res, next)
})

router.use((err, req, res, next) => {
	res.status(err.status || 500).json(err.message)
})

module.exports = router