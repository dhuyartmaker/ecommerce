const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var inventorySchema = new mongoose.Schema({
    inven_productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    inven_location: { type: String, default: "unknow" },
    inven_stock: { type: Number, default: 0 },
    inven_shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
    inven_reservations: { type: Array, default: [] },
    /**
     * cartId:
     * stock:
     * createdAt:
     */
}, {
    timestamps: true,
    collection: 'inventories'
});

//Export the model
module.exports = mongoose.model('Inventory', inventorySchema);