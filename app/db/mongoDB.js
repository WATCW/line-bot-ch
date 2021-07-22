const mongoose = require("mongoose");

var method = {
    connectToMongoDB: function () {

        let mongo_uri = process.env.DATABASE_ENDPOINT + '/' + process.env.DATABASE_NAME;
        let options = {
            useNewUrlParser: true,
            user: process.env.DATABASE_USER,
            pass: process.env.DATABASE_PASSWORD,
            socketTimeoutMS: 5000,
            connectTimeoutMS: 5000,
            serverSelectionTimeoutMS: 5000,
            useUnifiedTopology: true
        };
        return new Promise((resolve, reject) => {
            mongoose.connect(mongo_uri, options).then(() => {
                resolve({
                    status: true,
                    message: "MongoDB Connection is Opened"
                });
            }).catch(error => {
                reject({
                    status: false,
                    message: "Connect MongoDB Error: " + error
                });
            });
        });
    },
    disconnectDB: function () {
        return new Promise((resolve) => {
            mongoose.connection.close(function () {
                resolve(console.log("==== MongoDB Connection is Closed ===="));
            });
        });
    }
}

module.exports = method;