const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    itemId : {
        type : String,
        required: true,
        unique: true
    },
    itemName : {
        type: String,
        required: true,
    },
    quantity : Number,
    updateDate : String
})

const StockManagement = mongoose.model('house_stock_management', schema);

module.exports = StockManagement;