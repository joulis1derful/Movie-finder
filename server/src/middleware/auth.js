const config = require('../shared/config')
const jwt = require('jsonwebtoken')
const userService = require('../service/user')
const JWT_SECRET = config('JWT_SECRET')
const redis = require('../client/redis')
const REDIS_URL = config('REDIS_URL')

const createToken = async (email) => {
	const tokenExpSecs = 3600
	const user = await userService.getUserByEmail(email)
	const token = jwt.sign({ email, userId: user.userId }, JWT_SECRET, { expiresIn: tokenExpSecs })
	const client = redis.getRedisInstance({ url: REDIS_URL })
	await client.setex(user.userId, tokenExpSecs, token)
	redis.close(client)

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
				req.user = { email: decoded.email, userId: decoded.userId }
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