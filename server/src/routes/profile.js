const userService = require('../service/user')

const getById = async (req, res, next) => {
	const user = await userService.getUserById(req.params.id)
	if (user) {
		res.status(200).json({ userId: user.userId, email: user.email, watch_later: user.movies_to_watch })
	} else {
		const err = new Error('There is no such a profile')
		err.status = 404
		next(err)
	}
}

const addWatchLater = async (req, res, next) => {
	if (req.body && req.body.userId && req.body.movieId) {
		const { userId, movieId } = req.body
		await userService.addMovieToWatch(userId, movieId)
		res.status(200).json('Added successfully') 
	} else {
		const err = new Error('Either user id or movie id was not provided')
		err.status = 403
		next(err)
	}
}

const removeWatchLater = async (req, res, next) => {
	if (req.body && req.body.userId && req.body.movieId) {
		const { userId, movieId } = req.body
		await userService.removeMovieToWatch(userId, movieId)
		res.status(200).json('Removed successfully')  
	} else {
		const err = new Error('Either user id or movie id was not provided')
		err.status = 403
		next(err)
	}
}

module.exports = {
	getById,
	addWatchLater,
	removeWatchLater
}