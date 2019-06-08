const userService = require('../service/user')
const auth = require('../middleware/auth')
const redis = require('../client/redis')
const config = require('../shared/config')
const crypto = require('crypto')

const SALT = config('SALT')
const REDIS_URL = config('REDIS_URL')

const register = async (req, res, next) => {
	if (req.body && req.body.email && req.body.password) {
		const { email, password, firstName, lastName } = req.body
		const user = await userService.getUserByEmail(email, next)
		if (!user) {
			try {
				await userService.createUser(
					{ email, password, firstName, lastName },
					next
				)
				res.status(201).json({ message: 'You were registered successfully' })
			} catch (err) {
				next(err)
			}
		} else {
			const err = new Error('This user is already registered')
			err.status = 409
			next(err)
		}
	} else {
		const err = new Error('Email is not provided')
		err.status = 403
		next(err)
	}
}

const login = async (req, res, next) => {
	if (req.body && req.body.email && req.body.password) {
		const { email, password } = req.body
		const user = await userService.getUserByEmail(email, next)
		const passwordHash = crypto
			.pbkdf2Sync(password, SALT, 1000, 64, 'sha512')
			.toString('hex')
		if (!user) {
			const err = new Error('Cannot find user with this email')
			err.status = 409
			next(err)
		} else if (passwordHash !== user.password) {
			const err = new Error('Invalid password was provided')
			err.status = 409
			next(err)
		} else {
			const client = redis.getRedisInstance({ url: REDIS_URL })
			let token = await client.get(user.userId)
			if (!token) {
				token = await auth.createToken(email, next)
			}
			redis.close(client)
			res.set('Authorization', token)
			res
				.status(200)
				.json({ message: 'Log in succeeded', profile: { userId: user.userId } })
		}
	} else {
		const err = new Error('Either email or password was not provided')
		err.status = 403
		next(err)
	}
}

module.exports = {
	register,
	login
}
