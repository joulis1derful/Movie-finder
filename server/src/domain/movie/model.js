const config = require('../../shared/config')
const mongoClient = require('mongodb').MongoClient

const dbUrl = config('DB_URL')
const dbName = config('DB_NAME')
const USERNAME = config('USERNAME')
const PASSWORD = config('PASSWORD')

const insertMovie = async (movie) => {
	const client = await getConnection(dbUrl)
	const db = client.db(dbName)
	await db.collection('movie').insertOne(movie)
	client.close()
}

const findMovies = async (name) => {
	const client = await getConnection(dbUrl)
	const database = client.db(dbName)
	const movies = await database.collection('movie').find({ name: name }).toArray()
	client.close()

	return movies
}

const findMovie = async (id) => {
	const client = await getConnection(dbUrl)
	const db = client.db(dbName)
	const movie = await db.collection('movie').findOne({ id: parseInt(id) })
	client.close()

	return movie
}

const getConnection = async (url) => {
	try {
		return await mongoClient.connect(url, { useNewUrlParser: true })
	} catch (err) {
		// log.err
		console.log(err)
	}
}

module.exports = {
	insertMovie,
	findMovie,
	findMovies
}