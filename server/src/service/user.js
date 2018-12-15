const storage = require('../domain/user/model')

const getUserByEmail = async (email) => {
	return await storage.findUserByEmail(email)
}

const createUser = async (email, password) => {
	await storage.createUser(email, password)
}

module.exports = {
	createUser,
	getUserByEmail
}