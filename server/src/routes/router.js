const config = require('../shared/config')
const express = require('express')
const crypto = require('crypto')
const movieService = require('../service/movie')
const userService = require('../service/user')
const auth = require('../middleware/auth')
const bodyParser = require('body-parser')

const router = express.Router()
const SALT = config('SALT')

router.post('/register', bodyParser.json(), bodyParser.urlencoded({ extended: false }), async (req, res, next) => {
	if (req.body && req.body.email && req.body.password) {
		const { email, password } = req.body
		const user = await userService.getUserByEmail(email)
		if (!user) {
			try {
				await userService.createUser(email, password)
				res.status(201).json({ message: 'You were registered successfully' })
			} catch (err) {
				next(err)
			}
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

router.post('/login', bodyParser.json(), bodyParser.urlencoded({ extended: false }), async (req, res, next) => {
	if (req.body && req.body.email && req.body.password) {
		const { email, password } = req.body
		const user = await userService.getUserByEmail(email)
		const passwordHash = crypto.pbkdf2Sync(password, SALT, 1000, 64, 'sha512').toString('hex')
		if (!user) {
			const err = new Error('Cannot find user with this email')
			err.status = 409
			next(err)
		} else if (passwordHash !== user.password) {
			const err = new Error('Invalid password was provided')
			err.status = 409
			next(err)
		} else {
			const token = await auth.createToken(email)
			res.set('Authorization', token)
			res.status(200).json({ message: 'Log in succeeded', data: { userId: user.userId } })
		}
	} else {
		const err = new Error('Either email or password was not provided')
		err.status = 403
		next(err)
	}
})

router.use('/profile', (req, res, next) => { 
	auth.checkToken(req, res, next)
})

router.get('/profile/:id', async (req, res, next) => {
	const user = await userService.getUserById(req.params.id)
	if (user) {
		res.status(200).json({ userId: user.userId, email: user.email, watch_later: user.movies_to_watch })
	} else {
		const err = new Error('There is no such a profile')
		err.status = 404
		next(err)
	}
})

router.post('/profile/addWatchLater', bodyParser.json(), bodyParser.urlencoded({ extended: false }), async (req, res, next) => {
	if (req.body && req.body.userId && req.body.movieId) {
		const { userId, movieId } = req.body
		await userService.addMovieToWatch(userId, movieId)
		res.status(200).json('Added successfully') 
	} else {
		const err = new Error('Either user id or movie id was not provided')
		err.status = 403
		next(err)
	}
})

router.post('/profile/removeWatchLater', bodyParser.json(), bodyParser.urlencoded({ extended: false }), async (req, res, next) => {
	if (req.body && req.body.userId && req.body.movieId) {
		const { userId, movieId } = req.body
		await userService.removeMovieToWatch(userId, movieId)
		res.status(200).json('Removed successfully')  
	} else {
		const err = new Error('Either user id or movie id was not provided')
		err.status = 403
		next(err)
	}
})

router.get('/movies/top', async (req, res, next) => {
	const { page } = req.query
	const movies = await movieService.getTopMovies(next, page)

	res.status(200).json(movies)
})

router.get('/movies/search', async (req, res, next) => {
	const movies = await movieService.findMovieByName(req, res, next)

	res.status(200).json(movies)
})

router.get('/movies/:id', async (req, res, next) => {
	const { id } = req.params
	const movie = await movieService.findMovieById(id, next)

	res.status(200).json(movie)
})

router.use((err, req, res, next) => {
	res.status(err.status || 500).json(err.message)
})

module.exports = router