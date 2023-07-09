const mongoose = require('mongoose'); // Erase if already required
const slugify = require('slugify');

const productType = {
    Electronic: 'Electronic',
    Clothing: 'Clothing'
}

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: { type: String },
    product_price: { type: String, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: Object.keys(productType).map(k => productType[k]) },
    product_shop: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    product_attributes: { type: mongoose.Schema.Types.Mixed, required: true },
    product_slug: String,
    product_rating: {
        type: Number,
        default: 4.5,
        min: [1, "Min rating is 1"],
        max: [5, "Max rating is 2"],
        set: (val) => Math.round(val * 10) / 10
    },
    isDraft: {
        type: Boolean,
        default: true,
        index: true,
    },
    isPublic: {
        type: Boolean,
        default: false,
    }
}, {
    collection: 'products',
    timestamps: true
});

productSchema.index({ product_name: "text", product_description: "text "})

productSchema.pre("save", function (next) {
    console.log("=====", this)
    this.product_slug = slugify(this.product_name, { lower: true })
    next()
})

const clothingSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    size: String,
    material: String
}, {
    collection: 'clothes',
    timestamps: true
})

const electronicSchema = new mongoose.Schema({
    model: { type: String },
    color: String
}, {
    collection: 'electronics',
    timestamps: true
})

//Export the model
module.exports = {
    productModel: mongoose.model('Product', productSchema),
    clothingModel: mongoose.model('Clothes', clothingSchema),
    electronicModel: mongoose.model('Electronics', electronicSchema),
    productType
}