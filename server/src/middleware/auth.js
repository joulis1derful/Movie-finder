const config = require('../shared/config')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const userService = require('../service/user')
const JWT_SECRET = config('JWT_SECRET')
const SALT = config('SALT')

const createToken = async (req, res, next) => {
	const email = req.body.email
	const passwordHash = crypto.pbkdf2Sync(req.body.password, SALT, 1000, 64, 'sha512').toString('hex')

	const userId = await userService.createUser(email, passwordHash)
	const token = jwt.sign({ email, userId }, JWT_SECRET, { expiresIn: 7200 })
	return token
}

const checkToken = (req, res, next) => {
	let token = req.headers['x-access-token'] || req.headers['authorization']
	if (token && token.startsWith('Bearer ')) {
		// Remove Bearer from string
		token = token.slice(7, token.length)
	}

	if (token) {
		jwt.verify(token, JWT_SECRET, (err, decoded) => {
			if (err) {
				const error = new Error('Token is not valid')
				error.status = 401  
				next(error)
			} else {
				req.userId = decoded.userId
				next()
			}
		})
	} else {
		const error = new Error('Auth token is not supplied')
		error.status = 401  
		next(error)
	}
}

module.exports = {
	checkToken,
	createToken
}