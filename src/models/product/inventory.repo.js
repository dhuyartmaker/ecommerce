const inventoryModel = require("../inventory.model")

const insertInventory = async ({ productId, location = "unknow", stock, shopId }) => {
    return await inventoryModel.create({
        inven_location: location,
        inven_productId: productId,
        inven_stock: stock,
        inven_shopId: shopId
    })
}

module.exports = {
    insertInventory
}