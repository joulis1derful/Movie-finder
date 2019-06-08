const errors = (err, req, res, next) => {
	if (
		err.message === 'Auth token is not supplied' ||
		err.message === 'Token is not valid' ||
		err.message === 'UnauthorizedError'
	) {
		return res.status(401).json({ message: err.message })
	}

	if (
		err.message === 'Email is not provided' ||
		err.message === 'Either email or password was not provided' ||
		err.message === 'Invalid movie name was passed in' ||
		err.message === 'Invalid movie id was passed in'
	) {
		return res.status(403).json({ message: err.message })
	}

	if (
		err.message === 'This user is already registered' ||
		err.message === 'Cannot find user with this email' ||
		err.message === 'Invalid password was provided'
	) {
		return res.status(409).json({ message: err.message })
	}

	if (
		err.name === 'MongoNetworkError' &&
		/failed to connect to server/.test(err.message)
	) {
		return res.status(502).json({ message: 'Cannot connect to the database' })
	}

	return res.status(500).json({
		message: 'unknown error occurred',
		originalMessage: err.message
	})
}

module.exports = errors
