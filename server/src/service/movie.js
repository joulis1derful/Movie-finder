const config = require('../shared/config')
const storage = require('../domain/movie/model')
const axios = require('axios')

const API_KEY = config('API_KEY')
const SEARCH_MOVIES_URL = config('SEARCH_MOVIES_URL')
const TMDB_MOVIE_URL = config('TMDB_MOVIE_URL')

// TODO: insert to db if wasn't found at local db and was found on tmdb
const findMovieByName = async (req, res, next) => {
	const { name } = req.query
	if (!name) {
		const error = new Error('Invalid movie name was passed in')
		error.status = 403
		next(error)
	} else {
		const movies = await storage.findMovies(name)
		if (movies.length > 0) {
			return res.json(movies)
		}
		return axios.get(`${SEARCH_MOVIES_URL}?api_key=${API_KEY}&query=${name}`)
			.then((response) => { res.json(response.data.results) })
			.catch(err => next(err))
	}
}

const findMovieById = async (req, res, next) => {
	const { id } = req.params
	const regexp = /^\d+$/
	if (id && regexp.test(id)) {
		const movie = await storage.findMovie(id)
		if (movie) {
			return res.json(movie)
		} 
		await axios.get(`${TMDB_MOVIE_URL}/${id}?api_key=${API_KEY}`)
			.then((response) => { 
				const foundMovie = response.data
				storage.insertMovie(foundMovie)
				res.json(foundMovie) 
			})
			.catch(err => next(err) )
	} else {
		const error = new Error('Invalid movie id was passed in')
		error.status = 403
		next(error)
	}  
}

const getTopMovies = async (req, res, next) => {
	return axios.get(`${TMDB_MOVIE_URL}/top_rated?api_key=${API_KEY}`)
		.then((response) => { return res.json(response.data) })
		.catch((err) => { next(err) })
}

module.exports = {
	findMovieById,
	findMovieByName,
	getTopMovies
}