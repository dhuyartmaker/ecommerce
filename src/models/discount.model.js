const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var discountSchema = new mongoose.Schema({
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: false },
    discount_type: { type: String, default: "fixed_amount", enum: ["fixed_amount", "percentage"] },
    discount_value: { type: Number, required: true },
    discount_code: { type: String, required: true },
    discount_start_date: { type: Date },
    discount_end_date: { type: Date },
    discount_max_use: { type: Number },
    discount_used_count: { type: Number },
    discount_user_used: { type: Array, default: [] },
    discount_max_use_per_user: { type: Number },
    discount_min_value_order: { type: Number, required: true },
    discount_shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
    discount_active: { type: Boolean, deafult: true },
    discoint_applies_to: { type: String, default: 'all', enum: ['all', 'specific'] },
    discount_product_ids: { type: Array, default: [] }
}, {
    timestamps: true,
    collection: 'discount'
});

//Export the model
module.exports = mongoose.model('Discount', discountSchema);