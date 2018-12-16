const config = require('../../shared/config')
const mongoClient = require('mongodb').MongoClient

const dbUrl = config('DB_URL')
const dbName = config('DB_NAME')
const USERNAME = config('USERNAME')
const PASSWORD = config('PASSWORD')

const updateMoviesToWatch = async (userId, movieId, operation) => {
	const movieNumber = parseInt(movieId)
	const client = await getConnection(dbUrl)
	try {
		const db = client.db(dbName)
		const user = await db.collection('user').findOne({ userId: parseInt(userId) })
		const moviesCollection = user.movies_to_watch ? user.movies_to_watch : []
		if (operation === 'add') {
			if (moviesCollection.includes(movieNumber)) {
				return
			}
			moviesCollection.push(movieNumber)
		} else if (operation === 'remove') {
			const indexToRemove = moviesCollection.indexOf(movieNumber)
			if (indexToRemove !== -1) moviesCollection.splice(indexToRemove, 1)
		}
		await db.collection('user').updateOne({ userId: parseInt(userId) }, { $set: { movies_to_watch: moviesCollection } })
	} catch (err) {
		console.log(err)
	} finally {
		client.close()
	}
}

const createUser = async (email, password) => {
	const client = await getConnection(dbUrl)
	try {
		const db = client.db(dbName)
		const recordsLength = await db.collection('user').countDocuments()
		await db.collection('user').insertOne({ email, password, userId: recordsLength + 1, movies_to_watch: [] })
		return recordsLength + 1
	} catch (err) {
		console.log(err)
	} finally {
		client.close()
	}	
}

const findUserByEmail = async (email) => {
	const client = await getConnection(dbUrl)
	try {
		const database = client.db(dbName)
		const user = await database.collection('user').findOne({ email })
		return user
	} catch (err) {
		console.log(err)
	} finally {
		client.close()
	}
}

const findUserById = async (id) => {
	const client = await getConnection(dbUrl)
	try {
		const db = client.db(dbName)
		const user = await db.collection('user').findOne({ userId: parseInt(id) })
		return user
	} catch (err) {
		console.log(err)
	} finally {
		client.close()
	}
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
	createUser,
	findUserById,
	findUserByEmail,
	updateMoviesToWatch
}