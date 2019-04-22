const errors = (err, req, res, next) => {
	if (err.message === 'Auth token is not supplied' ||
		err.message === 'Token is not valid' || 
		err.message === 'UnauthorizedError') {
		return res.status(401).json({ message: err.message, code: err.status })
	}

	if (err.message === 'Email is not provided' ||
		err.message === 'Either email or password was not provided') {
		return res.status(403).json({ message: err.message, code: err.status })
	}

	if (err.message === 'This user is already registered' || 
		err.message === 'Cannot find user with this email' || 
		err.message === 'Invalid password was provided') {
		return res.status(409).json({ message: err.message, code: err.status })
	}

	return res.status(500).json({ message: 'unknown error occurred' })
}

module.exports = errors