const { NotFoundError, BadRequestError } = require("../core/error.response");
const cartModel = require("../models/cart.model");
const orderModel = require("../models/order.model");
const { productModel } = require("../models/product.model");
const discountService = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis.service");

class CheckoutService {
    /**
     * {
     *  cartId
     *  userId
     *  shop_order_ids: [
     *      {
     *          shopId
     *          shop_discounts: []
     *          item_products: [
     *              {
     *                  price
     *                  quantity
     *                  productId
     *              }
     *          ]
     *      }
     * ]
     * }
     */
    async checkoutReview({ cartId, userId, shop_order_ids }) {
        const foundCart = await cartModel.findById(cartId);
        if (!foundCart) throw new NotFoundError("Cart not found!")

        const checkoutOrder = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0
        }, shopOrderIdsNew = [];
        for (let i = 0; i < shop_order_ids.length; i += 1) {
            const itemOrder = shop_order_ids[i];

            const getProductFromDB = await new Promise.all(itemOrder.item_products.map(async(item) => {
                const findProduct = await productModel.findById(item.productId).select("_id product_price product_quantity")
                return {
                    ...findProduct,
                    productId: findProduct._id
                }
            }))

            const checkoutPrice = getProductFromDB.reduce((acc, item) => {
                const result = acc + (item.product_price * item.product_quantity)
                return result
            }, 0)

            checkoutOrder.totalPrice += checkoutPrice

            const itemCheckout = {
                shopId: itemOrder.shopId,
                shop_discounts: itemOrder.shop_discounts,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                itemProducts: getProductFromDB
            }

            if (itemOrder.shop_discounts && itemOrder.shop_discounts.length > 0) {
                const { amount } = await discountService.ApplyDiscountForShop({
                    shopId: itemCheckout.shopId,
                    userId,
                    code: itemCheckout.shop_discounts[0].codeId
                })

                if (amount > 0) {
                    checkoutOrder.totalDiscount += amount;
                    itemCheckout.priceApplyDiscount = checkoutPrice - amount
                }
            }

            checkoutOrder.totalCheckout += itemCheckout.priceApplyDiscount
            shopOrderIdsNew.push(itemCheckout)
        }

        return {
            shopOrderIdsNew,
            checkoutOrder
        }
    }

    async orderByUser({ cartId, userId, shop_order_ids }) {
        const { shopOrderIdsNew, checkoutOrder } = this.checkoutReview({ cartId, userId, shop_order_ids });
        // Recheck
        const products = shopOrderIdsNew.flatMap(order => order.itemProducts)
        const acquireProduct = [];
        for (let i = 0; i < products.length; i += 1) {
            const { productId, quanity } = products[i];
            const keyLock = await acquireLock(productId, quanity);
            acquireProduct.push(!!keyLock);
            if (keyLock) {
                releaseLock(keyLock)
            }
        }

        if (acquireProduct.includes(false)) {
            throw new BadRequestError("Something error!")
        }

        const newOrder = await orderModel.create({
            order_userId: userId,
            order_checkout: checkoutOrder,
            order_products: shopOrderIdsNew
        })

        //  Remove product from cart

        return newOrder;
    }
}

module.exports = new CheckoutService()