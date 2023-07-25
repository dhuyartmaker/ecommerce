const express = require("express");
const { apiKey, permission } = require("../../auth/checkAuth");
const { authenticate } = require("../../auth/authUtil");
const discountController = require("../../controllers/discount.controller");
const router = express.Router()

router.post('/v1/discount', discountController.create)

router.get('/v1/discount/products', discountController.getListProduct)
router.post('/v1/discount/apply', discountController.applyDiscount)
router.post('/v1/discount/cancel', discountController.cancelDiscount)

module.exports = router;