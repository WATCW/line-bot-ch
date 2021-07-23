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
    },
    createCollection: function(collection, model){
        return new Promise((resolve) => {
            // define Schema
            var dbSchema = mongoose.Schema({
                name: String,
                price: Number,
                quantity: Number
            });

            // compile schema to model
            var DbModel = mongoose.model('Book', dbSchema, 'bookstore');

            // a document instance
            var book1 = new DbModel({ name: 'Introduction to Mongoose', price: 10, quantity: 25 });

            // save model to database
            book1.save(function (err, book) {
                if (err) return console.error(err);
                console.log(book.name + " saved to bookstore collection.");
            });
        });
    },
    checkCollectionExists: function (collectionName){
        return new Promise((resolve)=>{
            mongoose.connection.db.listCollections({name: collectionName})
            .next(function(err, collinfo) {
                if (collinfo) {
                    console.log("Collection exist");
                    console.log(collinfo);
                }else {
                    console.log("Collection doesn't exist");
                }
            }); 
    });
   },
   findBookStoreByPrice:function (price){
       return new Promise((resolve) => {
        mongoose.connection.db.collection("bookstore", function(err, collection){
            if(err){
                console.log(err)
                resolve(err);
            }
            var qry = {
                "price": price
            };
            console.log('collection');
            console.log(collection);
            collection.find(qry).toArray(function(err, data){
                if(err){
                    console.log(err)
                    return resolve(data);
                }
                console.log(data)
                return resolve(data);
            })
        });
       });
   }
}

module.exports = method;