const config = require('../shared/config')
const crypto = require('crypto')
const storage = require('../domain/user/model')
const SALT = config('SALT')

const getUserByEmail = async (email) => {
	return await storage.findUserByEmail(email)
}

const getUserById = async (id) => {
	return await storage.findUserById(id)
}

const addMovieToWatch = async (userId, movieId) => {
	return await storage.updateMoviesToWatch(userId, movieId, 'add')
}

const removeMovieToWatch = async (userId, movieId) => {
	return await storage.updateMoviesToWatch(userId, movieId, 'remove')
}

const createUser = async (email, password) => {
	const passwordHash = crypto.pbkdf2Sync(password, SALT, 1000, 64, 'sha512').toString('hex')

	return await storage.createUser(email, passwordHash)
}

module.exports = {
	addMovieToWatch,
	createUser,
	getUserByEmail,
	getUserById,
	removeMovieToWatch
}