const express = require("express");
const { apiKey, permission } = require("../../auth/checkAuth");
const { authenticate } = require("../../auth/authUtil");
const productController = require("../../controllers/product.controller");
const router = express.Router()

router.get('/all', productController.getAll)

router.use(authenticate)
router.post('/', productController.create)

router.patch('/:id', productController.updatePatch)
router.get('/:id', productController.getDetail)

router.get('/drafts/all', productController.getAllDraft)

module.exports = router;