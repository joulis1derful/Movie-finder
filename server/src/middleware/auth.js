const config = require('../shared/config')
const jwt = require('jsonwebtoken')
const userService = require('../service/user')
const JWT_SECRET = config('JWT_SECRET')

const createToken = async (req, res, next) => {
	const email = req.body.email
	const passwordHash = req.body.password

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
				res.redirect(`/profile/${decoded.userId}`)
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