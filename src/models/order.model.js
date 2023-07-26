const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    order_userId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    order_checkout: { type: mongoose.Schema.Types.Mixed, default: {} },
    /** 
     * order_checkout { totalPrice, totalApplyDiscount, feeShip }
    */
    order_shipping: { type: mongoose.Schema.Types.Mixed, default: {} },
    order_payment: { type: mongoose.Schema.Types.Mixed, default: {} },
    order_products: { type: Array, default: {} },
    order_status: { type: String, default: 'pending', enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered']}
}, {
    timestamps: true,
    collection: 'orders'
});

//Export the model
module.exports = mongoose.model('Order', orderSchema);