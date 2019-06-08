const config = require('../shared/config')
const crypto = require('crypto')
const storage = require('../domain/user/model')
const SALT = config('SALT')

const getUserByEmail = async (email, next) => {
	return storage.findUserByEmail(email, next)
}

const getUserById = async id => {
	return storage.findUserById(id)
}

const addMovieToWatch = async (userId, movieId) => {
	return storage.updateMoviesToWatch(userId, movieId, 'add')
}

const removeMovieToWatch = async (userId, movieId) => {
	return storage.updateMoviesToWatch(userId, movieId, 'remove')
}

const createUser = async (user, next) => {
	const { email, password, firstName, lastName } = user
	const passwordHash = crypto
		.pbkdf2Sync(password, SALT, 1000, 64, 'sha512')
		.toString('hex')

	return storage.createUser({ email, passwordHash, firstName, lastName }, next)
}

module.exports = {
	addMovieToWatch,
	createUser,
	getUserByEmail,
	getUserById,
	removeMovieToWatch
}
