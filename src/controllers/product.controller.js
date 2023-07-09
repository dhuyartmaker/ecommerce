const { BadRequestError } = require("../core/error.response");
const { CreatedResponseSuccess, OkResponseMessage } = require("../core/success.response");
const { asyncHandler } = require("../helpers/asyncHandler");
const {productModel} = require("../models/product.model");
const { ProductFactory } = require("../services/product.service");

class ProductController {
    create = asyncHandler(async (req, res, next) => {
        const payload = req.body;
        const type = payload.product_type;
        payload.product_shop = req.shopId;
        if (!type) throw new BadRequestError("Require product_type!");
        return new CreatedResponseSuccess({
            metadata: await ProductFactory.createProduct(type, payload)
        }).send(res)
    })

    getAllDraft = asyncHandler(async (req, res, next) => {
        return new OkResponseMessage({
            metadata: await ProductFactory.getAllDraft(req.query)
        }).send(res)
    })

    getAll = asyncHandler(async (req, res, next) => {
        return new OkResponseMessage({
            metadata: await ProductFactory.getAllProduct(req.query)
        }).send(res)
    })

    updatePatch = asyncHandler(async (req, res, next) => {
        if (!req.params.id) throw new BadRequestError("Id is required!")
        return new OkResponseMessage({
            metadata: await ProductFactory.updatePatchProduct(req.params.id, req.body)
        }).send(res)
    })

    getDetail = asyncHandler(async (req, res, next) => {
        if (!req.params.id) throw new BadRequestError("Id is required!")
        return new OkResponseMessage({
            metadata: await productModel.findById(req.params.id)
        }).send(res)
    })
}

module.exports =  new ProductController();