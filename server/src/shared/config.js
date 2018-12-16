const convict = require('convict')
require('dotenv').config()

const definitions = {
	APP_PORT: {
		env: 'APP_PORT',
		format: 'port',
		default: 3000,
	},
	JWT_SECRET: {
		env: 'JWT_SECRET',
		format: String,
		default: 'jwt-secret',
	},
	API_KEY: {
		env: 'API_KEY',
		format: 'String',
		default: ''
	},
	SEARCH_MOVIES_URL: {
		env: 'SEARCH_MOVIES_URL',
		format: String,
		default: '',
	},
	TMDB_MOVIE_URL: {
		env: 'TMDB_MOVIE_URL',
		format: String,
		default: '',
	},
	DB_URL: {
		env: 'DB_URL',
		format: String,
		default: 'mongodb://localhost:27017',
	},
	DB_NAME: {
		env: 'DB_NAME',
		format: String,
		default: '',
	},
	USERNAME: {
		env: 'USERNAME',
		format: String,
		default: '',
	},
	PASSWORD: {
		env: 'PASSWORD',
		format: String,
		default: ''
	},
	SALT: {
		env: 'SALT',
		format: String,
		default: ''
	}
}

const schema = convict(definitions)
schema.validate({ allowed: 'strict' })

const config = (name) => {
	if (schema.get(name) != null) return schema.get(name)
	throw Error(`environment variable ${definitions[name].env} is required`)
}

/*
 * Fail fast!
 */
Object.keys(definitions).forEach((key) => {
	try {
		config(key)
	} catch (err) {
		throw new Error(`Missing config for ${key}`)
	}
})

module.exports = config