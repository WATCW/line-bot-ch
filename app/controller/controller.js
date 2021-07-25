var StockDb = require('../model/stockItem');
const mongodb = require("../db/mongoDB");
// create and save new user
exports.create = (req,res)=>{
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }

    // new user
    const stock = new StockDb({
        itemId : req.body.itemId,
        itemName : req.body.itemName,
        quantity: req.body.quantity,
        lastBuyDate: req.body.lastBuyDate
    })
console.log('do create.')
    // save user in the database
    stock
        .save(stock)
        .then(data => {
            //res.send(data)
            done(null, data);
            res.redirect('/');
        })
        .catch(err =>{
            console.log(err);
            res.status(500).send({
                message : err.message || "Some error occurred while creating a create operation"
            });
        });

}

async function connectDb() {
    try {
      await mongodb.connectToMongoDB().then((result) => {
       console.log(result);
      }).catch((error) => {
        console.log('Error connect db');
        throw new Error(error.message);
      });
    }
    catch (err) {
      console.log(err);
    }
  }
// retrieve and return all users/ retrive and return a single user

exports.find = (req, res)=>{
console.log('do find')
connectDb();
    if(req.query.id){
        const id = req.query.id;

        StockDb.findById(id)
            .then(data =>{
                if(!data){
                    res.status(404).send({ message : "Not found item with id "+ id})
                }else{
                    res.send(data)
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Erro retrieving item with id " + id})
            })

    }else{
        StockDb.find()
            .then(i => {
                res.send(i)
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving item information" })
            })
    }

    
}
/*
// Update a new idetified user by user id
exports.update = (req, res)=>{
    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

    const id = req.params.id;
    Userdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Update user with ${id}. Maybe user not found!`})
            }else{
                res.send(data)
            }
        })
        .catch(err =>{
            res.status(500).send({ message : "Error Update user information"})
        })
}

// Delete a user with specified user id in the request
exports.delete = (req, res)=>{
    const id = req.params.id;

    Userdb.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                res.send({
                    message : "User was deleted successfully!"
                })
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
}
*/