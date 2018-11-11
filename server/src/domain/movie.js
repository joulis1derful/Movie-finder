const dotenv = require("dotenv").config()
const mongoClient = require("mongodb").MongoClient;
const dbUrl = process.env.DB_URL;
const dbName = process.env.DB_NAME;

const insertToDb = async (dbName, movie) => {
    const client = getConnection(dbUrl)
    const db = client.db(dbName)
    await db.collection('movie').insertOne(movie);
    
    client.close();
}

const getConnection = (url) => {
    mongoClient.connect(url, (err, client) => {
        if (err) {
            throw new Error(err);
        }
        return client
    });
}