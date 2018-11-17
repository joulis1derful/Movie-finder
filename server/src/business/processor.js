const storage = require('../domain/movie')
const axios = require('axios')
const dotenv = require("dotenv").config()

const API_KEY = process.env.API_KEY
const SEARCH_MOVIES_URL = process.env.SEARCH_MOVIES_URL
const TMDB_MOVIE_URL = process.env.TMDB_MOVIE_URL

// TODO: insert to db if wasn't found at local db and was found on tmdb
const findMovieByName = async (name) => {
    const movies = await storage.findMovies(name)
    if (movies.length > 0) {
        return movies
    }
    return axios.get(`${SEARCH_MOVIES_URL}?api_key=${API_KEY}&query=${name}`)
         .then((response) => { return response.data.results })
         .catch((err) => { throw new Error(err) })
}

// TODO: insert to db if wasn't found at local db and was found on tmdb
const findMovieById = async (id) => {
    const movie = await storage.findMovie(id)
    if (movie) {
        return movie
    }
    return axios.get(`${TMDB_MOVIE_URL}/${id}?api_key=${API_KEY}`)
         .then((response) => { return response.data })
         .catch((err) => { throw new Error(err) })
}

const getTopMovies = async () => {
    return axios.get(`${TMDB_MOVIE_URL}/top_rated?api_key=${API_KEY}`)
         .then((response) => { return response.data })
         .catch((err) => { throw new Error(err) })
}

module.exports = {
    findMovieById,
    findMovieByName,
    getTopMovies
}