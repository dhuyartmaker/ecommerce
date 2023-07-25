const { BadRequestError, NotFoundError } = require("../core/error.response");
const discountModel = require("../models/discount.model");
const { productModel } = require("../models/product.model");

class DiscountService {
    /**
     * Apply discount
     * Payload: {
     *  Products: [{ shopId, productId, quantity, name, price }]
     * }
     */
    async ApplyDiscountForShop({ shopId, products = [], code }) {
        const findDiscount = await discountModel.findOne({ discount_code: code, discount_shopId: shopId })
        if (!findDiscount) throw new NotFoundError("Not found discount!")

        if (!findDiscount.discount_max_use) throw new BadRequestError("Discount is out of stock!")
        if (!findDiscount.discount_active) throw new BadRequestError("Discount is unactive!")

        let totalPriceOrder = 0
        if (findDiscount.discount_min_value_order > 0) {
            totalPriceOrder = products.reduce((acc, item) => {
                return acc + item.price * item.quantity
            }, 0)

            if (totalPriceOrder < findDiscount.discount_min_value_order)
                throw new BadRequestError(`Total price must be larger than ${findDiscount.discount_min_value_order}`)
        }

        if (findDiscount.discount_max_use_per_user > 0) {
            const countUserUseThisDiscount = findDiscount.discount_user_used.filter(usedItem => usedItem.userId === userId);
            if (countUserUseThisDiscount.length >= findDiscount.discount_max_use_per_user) {
                throw new BadRequestError("User is used max discount items!")
            }
        }

        const amount = findDiscount.discount_type === "fixed_amount" ? findDiscount.discount_value : (totalPriceOrder * findDiscount.discount_value) / 100

        return {
            amount,
            totalPriceOrder,
            totalFinalPrice: totalPriceOrder - amount
        }
    } 

    /**
     * Create Discount
     */
    static async CreateDiscount({ payload }) {
        const {
            discount_name,
            discount_description,
            discount_type = "fixed_amount",
            discount_value = 0,
            discount_code = "",
            discount_start_date = new Date(),
            discount_end_date,
            discount_max_use,
            discount_max_use_per_user = 0,
            discount_min_value_order = 0,
            discount_shopId,
            discoint_applies_to = "all",
        } = payload;

        const findByCode = await discountModel.findOne({ discount_code, discount_shopId });
        if (findByCode && findByCode.discount_active) {
            throw new BadRequestError("Discount exists!")
        }

        return await discountModel.create({
            discount_name,
            discount_description,
            discount_type,
            discount_value,
            discount_code,
            discount_start_date,
            discount_end_date,
            discount_max_use,
            discount_max_use_per_user,
            discount_min_value_order,
            discount_shopId,
            discoint_applies_to,
        })
    }

    /**
     * Cancel Discount
     */
    static async CancelDiscount({ codeId, userId }) {
        const foundDiscount = await discountModel.findOne({ discount_code: codeId })
        if (!foundDiscount) throw new BadRequestError("Discount not found!")

        const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_user_used: userId
            },
            $inc: {
                discount_max_use: 1,
                discount_used_count: -1
            }
        }, {
            new: true
        })

        return result;
    }

    static async GetListProductAppliedForDiscount({ codeId }) {
        const foundDiscount = await discountModel.findOne({ discount_code: codeId })
        const productIds = foundDiscount.discount_product_ids.map(ids => ids.productId)

        return await productModel.find({ _id: { $in: productIds } }).select({ _id: 1, name: 1, price: 1 })
    }
}

module.exports = new DiscountService()