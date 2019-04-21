const config = require('../../shared/config')
const mongoClient = require('mongodb').MongoClient

const dbUrl = config('DB_URL')
const dbName = config('DB_NAME')
const USERNAME = config('USERNAME')
const PASSWORD = config('PASSWORD')

const insertMovie = async (movie) => {
	const client = await getConnection(dbUrl)
	try {
		const db = client.db(dbName)
		await db.collection('movie').insertOne(movie)
	} catch (err) {
		throw err
	} finally {
		client.close()
	}
}

const findMovies = async (name) => {
	const client = await getConnection(dbUrl)
	try {
		const database = client.db(dbName)
		const movies = await database.collection('movie').find({ name: name }).toArray()
		return movies
	} catch (err) {
		throw err
	} finally {
		client.close()
	}	
}

const findMovie = async (id) => {
	const client = await getConnection(dbUrl)
	try {
		const db = client.db(dbName)
		const movie = await db.collection('movie').findOne({ id: parseInt(id) })
		return movie
	} catch (err) {
		throw err
	} finally {	
		client.close()
	}
}

const getConnection = async (url) => {
	try {
		return await mongoClient.connect(url, { useNewUrlParser: true })
	} catch (err) {
		throw err
	}
}

module.exports = {
	insertMovie,
	findMovie,
	findMovies
}