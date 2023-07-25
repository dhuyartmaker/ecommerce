const express = require("express");
const router = express.Router()

router.use('/v1/api/shop', require('./access'))
router.use('/v1/api/product', require('./product'))
router.use('/v1/api/discount', require('./discount'))

module.exports = router;