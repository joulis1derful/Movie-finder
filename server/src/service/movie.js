const config = require('../shared/config')
const storage = require('../domain/movie/model')
const axios = require('axios')

const API_KEY = config('API_KEY')
const SEARCH_MOVIES_URL = config('SEARCH_MOVIES_URL')
const TMDB_MOVIE_URL = config('TMDB_MOVIE_URL')

// TODO: insert to db if wasn't found at local db and was found on tmdb
const findMovieByName = (name) => async (req, res, next) => {
	const movies = await storage.findMovies(name)
	if (movies.length > 0) {
		return movies
	}
	return axios.get(`${SEARCH_MOVIES_URL}?api_key=${API_KEY}&query=${name}`)
		.then((response) => { return response.data.results })
		.catch(err => next(err))
}

// TODO: insert to db if wasn't found at local db and was found on tmdb
const findMovieById = (id) => async (req, res, next) => {
	const movie = await storage.findMovie(id)
	if (movie) {
		return movie
	}
	const foundMovie = await axios.get(`${TMDB_MOVIE_URL}/${id}?api_key=${API_KEY}`)
		.then((response) => { return response.data })
		.catch(err => next(err) )

	await storage.insertMovie(foundMovie)

	return foundMovie
}

const getTopMovies = () => async (req, res, next) => {
	return axios.get(`${TMDB_MOVIE_URL}/top_rated?api_key=${API_KEY}`)
		.then((response) => { return response.data })
		.catch((err) => { next(err) })
}

module.exports = {
	findMovieById,
	findMovieByName,
	getTopMovies
}