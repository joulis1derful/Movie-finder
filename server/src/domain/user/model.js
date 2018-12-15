const config = require('../../shared/config')
const mongoClient = require('mongodb').MongoClient

const dbUrl = config('DB_URL')
const dbName = config('DB_NAME')
const USERNAME = config('USERNAME')
const PASSWORD = config('PASSWORD')

const createUser = async (email, password) => {
	const client = await getConnection(dbUrl)
	try {
		const db = client.db(dbName)
		const recordsLength = await db.collection('user').countDocuments()
		await db.collection('user').insertOne({ email, password, userId: recordsLength + 1 })
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
		const user = await db.collection('user').findOne({ id: parseInt(id) })
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
	findUserByEmail
}