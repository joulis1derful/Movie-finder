const movieService = require('../service/movie')

const getTopMovies = async (req, res, next) => {
	const { page } = req.query
	try {
		const movies = await movieService.getTopMovies(page)
		res.status(200).json(movies)
	} catch (err) {
		next(err)
	}
}

const findMovieByName = async (req, res, next) => {
	const { name, page } = req.query
	try {
		const movies = await movieService.findMovieByName(name, page)
		res.status(200).json(movies)
	} catch (err) {
		next(err)
	}
}

const getMovieById = async (req, res, next) => {
	const { id } = req.params
	try {
		const movie = await movieService.findMovieById(id)
		res.status(200).json(movie)
	} catch (err) {
		next(err)
	}
}

module.exports = {
	getTopMovies,
	findMovieByName,
	getMovieById
}