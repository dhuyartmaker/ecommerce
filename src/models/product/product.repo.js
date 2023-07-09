const { NotFoundError } = require('../../core/error.response');
const { productModel } = require('../product.model');
/**
 * 
 * @param {*} param0 
 * @returns 
 */
const findAllDraft = async ({ query = {}, skip = 0, limit = 10 }) => {
    return await queryProduct({query, skip, limit})
}

/**
 * 
 * @param {*} param0 
 */
const findAllProduct = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    return await productModel.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(select.reduce((result, item) => ({ ...result, [item]: 1 }), {}))
    .lean()
    .exec()
}

/**
 * 
 * @param {*} param0 
 * @returns 
 */
const searchProductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch);
    const results = await productModel.find({
        isPublic: true,
        $text: { $search: regexSearch }
    },{
        score: { $meta: 'textScore' }
    })
    .sort({
        score: { $meta: 'textScore' }
    })
    .lean()

    return results;
}

/**
 * 
 * @param {*} param0 
 * @returns 
 */
const queryProduct = async({ query = {}, skip = 0, limit = 10 }) => {
    return await productModel.find(query)
        .populate('product_shop', 'name email -_id')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

/**
 * 
 * @param {*} param0 
 * @returns 
 */
const publicsProductByShop = async ({ shopId, productId }) => {
    const foundShop = await productModel.findOne({
        product_shop: shopId,
        _id: productId
    })
    if (!foundShop) throw new NotFoundError("Not found product")
    const payload = {
        isPublic: true,
        isDraft: false,
    };

    return await foundShop.update(payload)
}

/**
 * 
 * @param {*} param0 
 * @returns 
 */
const unPublicsProductByShop = async ({ shopId, productId }) => {
    const foundShop = await productModel.findOne({
        product_shop: shopId,
        _id: productId
    })
    if (!foundShop) throw new NotFoundError("Not found product")
    const payload = {
        isPublic: false,
    };

    return await foundShop.update(payload)
}

const updateProductById = async ({ productId, payload }) => {
    return await productModel.findByIdAndUpdate(productId, payload, { new: true })
}

module.exports = {
    findAllDraft,
    queryProduct,
    publicsProductByShop,
    unPublicsProductByShop,
    searchProductByUser,
    findAllProduct,
    updateProductById,
}