const { CreatedResponseSuccess } = require("../core/success.response");
const { asyncHandler } = require("../helpers/asyncHandler");
const accessService = require("../services/access.service");

class AccesController {
    signUp = asyncHandler(async (req, res, next) => {
        return new CreatedResponseSuccess({
            message: "Registed!",
            metadata: await accessService.signUp(req.body)
        }).send(res)
    })

    signIn = asyncHandler(async (req, res, next) => {
        return new CreatedResponseSuccess({
            message: "Success!",
            metadata: await accessService.signIn(req.body)
        }).send(res)
    })

    signOut = asyncHandler(async(req, res, next) => {
        return new CreatedResponseSuccess({
            message: "Success!",
            metadata: await accessService.signOut(req.keyStore)
        }).send(res)
    })
}

module.exports =  new AccesController();