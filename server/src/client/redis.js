const redis = require('async-redis')

const getRedisInstance = options => {
	return redis.createClient(options)
}

const close = client => {
	client.quit()
}

module.exports = {
	getRedisInstance,
	close
}
