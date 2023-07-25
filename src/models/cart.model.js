const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema({
    cart_products: { type: Array, default: [] },
    /**
     * [
        * {
        *   product_id
        *   shop_id
        *   shop_name
        *   price
        *   quantity
        *   name
        * }
     * ]
     */
    cart_count_products: { type: Number, default: 0 },
    // cart_discount: { type: Array, default: [] },
    cart_total: { type: Number, default: 0 },
    cart_user_id: { type: Number, default: 0 },
    cart
}, {
    timestamps: true,
    collection: 'Cart'
});

//Export the model
module.exports = mongoose.model('Cart', cartSchema);