const errors = (err, req, res, next) => {
	if (err.name === 'UnauthorizedError') {
		return res.status(401).json({ message: err.message, name: err.name })
	}

	return res.status(500).json({
		message: 'unknown error occurred'
	})
}

module.exports = errors