const { BadRequestError } = require("../core/error.response");
const { CreatedResponseSuccess, OkResponseMessage } = require("../core/success.response");
const { asyncHandler } = require("../helpers/asyncHandler");
const discountService = require("../services/discount.service");

class DiscountController {
    create = asyncHandler(async (req, res, next) => {
        const payload = req.body;
        return new CreatedResponseSuccess({
            metadata: await discountService.CreateDiscount({ payload })
        }).send(res)
    })

    getListProduct = asyncHandler(async (req, res, next) => {
        return new OkResponseMessage({
            metadata: await discountService.GetListProductAppliedForDiscount({ codeId: req.params.code })
        }).send(res)
    })

    applyDiscount = asyncHandler(async (req, res, next) => {
        const { shopId, products, code } = req.body;
        return new OkResponseMessage({
            metadata: await discountService.ApplyDiscountForShop({ shopId, products, code })
        }).send(res)
    })

    cancelDiscount = asyncHandler(async (req, res, next) => {
        const { codeId, userId } = req.body
        return new OkResponseMessage({
            metadata: await discountService.CancelDiscount({ codeId, userId })
        }).send(res)
    })
}

module.exports = new DiscountController ();