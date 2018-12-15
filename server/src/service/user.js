const storage = require('../domain/user/model')

const getUserByEmail = async (email) => {
	return await storage.findUserByEmail(email)
}

const updateMoviesToWatch = async (userId, movieId) => {
	return await storage.updateMoviesToWatch(userId, movieId)
}

const createUser = async (email, password) => {
	return await storage.createUser(email, password)
}

module.exports = {
	createUser,
	getUserByEmail,
	updateMoviesToWatch
}