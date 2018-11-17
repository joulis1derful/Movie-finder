const dotenv = require("dotenv").config()
const mongoClient = require("mongodb").MongoClient

const dbUrl = process.env.DB_URL
const dbName = process.env.DB_NAME

const insertMovie = async (movie) => {
    const client = getConnection(dbUrl)
    const db = client.db(dbName)
    await db.collection('movie').insertOne(movie)
    
    client.close()
}

const findMovies = async (name) => {
    const client = await getConnection(dbUrl)
    const database = await client.db(dbName)
    const movies = await database.collection('movie').find({ name: name }).toArray()
    client.close()

    return movies
}

const findMovie = async (id) => {
    const client = getConnection(dbUrl)
    const db = client.db(dbName)
    const movie = await db.collection('movie').findOne({ movieId: id })
    client.close()

    return movie
}

const getConnection = (url) => {
    return new Promise((resolve, reject) => {
        mongoClient.connect(url, (err, client) => {
            if (err) {
                reject(err)
            }
            resolve(client)
        })
    }) 
}

module.exports = {
    insertMovie,
    findMovie,
    findMovies
}