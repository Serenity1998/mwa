require('dotenv').config();
const { MongoClient, ObjectId } = require("mongodb");
let _connection = null;

const open = function () {
    if (get() == null)
        MongoClient.connect(process.env.DB_URL, function (err, client) {
            if (err) {
                console.log("DB connection failed:", err);
                return;
            }
            _connection = client.db(process.env.DB_NAME);
            console.log("DB connection open:", _connection.namespace);
        });
}

const close = function () {
    try {
        _connection?.client.close()
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
    }
}

const get = function (collection) {
    return _connection?.collection(collection);
}

module.exports = {
    open,
    get,
    close,
    ObjectId
};