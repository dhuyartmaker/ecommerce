const shopModel = require("../models/shop.model")

class ShopService {
    findByEmail = async ({ email, select = {}}) => {
        const baseSelect = {
            name: 1,
            email: 1,
            status: 1,
            roles: 1
        }
        return await shopModel.findOne({ email }).select({
            ...baseSelect,
            ...select
        }).lean()
    }
}

module.exports = new ShopService();