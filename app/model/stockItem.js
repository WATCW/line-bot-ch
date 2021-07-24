const mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({
    itemId: { type: String, required: true, unique: true },
    itemName: { type: String, required: true },
    quantity: { type: Number },
    lastBuyDate: { type: String }
});
itemSchema.index({ itemId: 1}, { unique: true })
const StockManagement = mongoose.model('house_stock_management', itemSchema);
module.exports = StockManagement;