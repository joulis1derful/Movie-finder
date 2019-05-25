const config = require('../shared/config')
const storage = require('../domain/movie/model')
const axios = require('axios')

const API_KEY = config('API_KEY')
const SEARCH_MOVIES_URL = config('SEARCH_MOVIES_URL')
const TMDB_MOVIE_URL = config('TMDB_MOVIE_URL')

const findMovieByName = async (name, page) => {
	if (!name) {
		const error = new Error('Invalid movie name was passed in')
		error.status = 403
		throw error
	} else {
		const movies = await storage.findMovies(name)
		if (movies.length > 0) {
			return movies
		}
		let searchUrl = `${SEARCH_MOVIES_URL}?api_key=${API_KEY}&query=${name}`
		if (page) {
			searchUrl += `&page=${page}`
		}
		return axios.get(searchUrl)
			.then((response) => { return { movies: response.data.results, totalPages: response.data.total_pages } })
			.catch(err => { throw err })
	}
}

const findMovieById = async (id) => {
	const regexp = /^\d+$/
	if (id && regexp.test(id)) {
		const movie = await storage.findMovie(id)
		if (movie) {
			return movie
		} 
		return await axios.get(`${TMDB_MOVIE_URL}/${id}?api_key=${API_KEY}`)
			.then((response) => { 
				const foundMovie = response.data
				storage.insertMovie(foundMovie)
				return foundMovie
			})
			.catch(err => { throw err } )
	} else {
		const error = new Error('Invalid movie id was passed in')
		error.status = 403
		throw error
	}  
}

const getTopMovies = async (page) => {
	let link = page ? `${TMDB_MOVIE_URL}/top_rated?page=${page}&api_key=${API_KEY}` : `${TMDB_MOVIE_URL}/top_rated?api_key=${API_KEY}`
	return axios.get(link)
		.then((response) => { return response.data })
		.catch((err) => { throw err })
}

module.exports = {
	findMovieById,
	findMovieByName,
	getTopMovies
}