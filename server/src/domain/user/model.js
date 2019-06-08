const config = require('../../shared/config')
const mongoClient = require('mongodb').MongoClient
const movieService = require('../../service/movie')

const dbUrl = config('DB_URL')
const dbName = config('DB_NAME')
const USERNAME = config('USERNAME')
const PASSWORD = config('PASSWORD')

const updateMoviesToWatch = async (userId, movieId, operation, next) => {
	const movieNumber = parseInt(movieId)
	const client = await getConnection(dbUrl)
	try {
		const db = client.db(dbName)
		const user = await db
			.collection('user')
			.findOne({ userId: parseInt(userId) })
		const moviesCollection = user.movies_to_watch ? user.movies_to_watch : []
		if (operation === 'add') {
			moviesCollection.forEach(movie => {
				if (movie && movie.id === movieNumber) {
					return
				}
			})
			const movie = await movieService.findMovieById(movieNumber)
			moviesCollection.push(movie)
		} else if (operation === 'remove') {
			moviesCollection.forEach((movie, index) => {
				if (movie && movie.id === movieNumber) {
					moviesCollection.splice(index, 1)
					return
				}
			})
		}
		await db
			.collection('user')
			.updateOne(
				{ userId: parseInt(userId) },
				{ $set: { movies_to_watch: moviesCollection } }
			)
	} catch (err) {
		next(err)
	} finally {
		client.close()
	}
}

const createUser = async (user, next) => {
	const client = await getConnection(dbUrl, next)
	const { email, password, firstName, lastName } = user
	try {
		const db = client.db(dbName)
		const recordsLength = await db.collection('user').countDocuments()
		await db.collection('user').insertOne({
			email,
			password,
			firstName,
			lastName,
			userId: recordsLength + 1,
			movies_to_watch: []
		})
		return recordsLength + 1
	} catch (err) {
		next(err)
	} finally {
		client.close()
	}
}

const findUserByEmail = async (email, next) => {
	const client = await getConnection(dbUrl, next)
	try {
		const database = client.db(dbName)
		const user = await database.collection('user').findOne({ email })
		return user
	} catch (err) {
		next(err)
	} finally {
		client.close()
	}
}

const findUserById = async (id, next) => {
	const client = await getConnection(dbUrl, next)
	try {
		const db = client.db(dbName)
		const user = await db.collection('user').findOne({ userId: parseInt(id) })
		return user
	} catch (err) {
		next(err)
	} finally {
		client.close()
	}
}

const getConnection = async (url, next) => {
	return mongoClient
		.connect(url, {
			useNewUrlParser: true
		})
		.catch(err => {
			next(err)
		})
}

module.exports = {
	createUser,
	findUserById,
	findUserByEmail,
	updateMoviesToWatch
}
