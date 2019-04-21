const express = require('express')
const errors = require('../middleware/errors')
const auth = require('./auth')
const movie = require('./movie')
const profile = require('./profile')
const authMiddleware = require('../middleware/auth')

const setupRoutes = () => {
	const router = express.Router()

	router.post('/register', auth.register)
	router.post('/login', auth.login)
  
	router.get('/movies/top', movie.getTopMovies)
	router.get('/movies/search', movie.findMovieByName)
	router.get('/movies/:id', movie.getMovieById)

	router.use('/profile', authMiddleware.checkToken)
  
	router.get('/profile/:id', profile.getById)
	router.post('/profile/addWatchLater', profile.addWatchLater)
	router.post('/profile/removeWatchLater', profile.removeWatchLater)
   
	router.use(errors)
  
	return router
}
  
module.exports = setupRoutes
  