const { NotFoundError } = require("../core/error.response");
const cartModel = require("../models/cart.model");
const {productModel} = require("../models/product.model");

class CartService {
    static async addToCart ({ userId, product }) {
        const findProduct = await productModel.findById(product._id);
        if (!findProduct) throw new NotFoundError
        const findCart = await cartModel.findOne({ cart_userId: userId })

        if (!findCart) {
            return await cartModel.create({
                cart_products: [product],
                cart_count_product: 1,
                cart_userId: userId
            })
        }

        const updateCart = await cartModel.findOneAndUpdate(
            {
                userId,
            }, {
                $addToSet: {
                    cart_products: product
                },
                $inc: {
                    cart_count_product: 1
                }
            },
            {
                new: true
            }
        )

        return updateCart;
    }

    static async updateQuantity ({ userId, product, quantity }) {
        const findProduct = await productModel.findById(product._id);
        if (!findProduct) throw new NotFoundError

        const query = {
            cart_user_id: userId,
            "cart_products.productId": product,
        }
        const payloadUpdate = {
            $inc: {
                "cart_products.$.quantity": quantity
            }
        }

        const cart = await cartModel.findOneAndUpdate(query, payloadUpdate, { new: true })
        return cart;
    }
}

module.exports = new CartService()