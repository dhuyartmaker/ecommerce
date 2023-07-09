const express = require("express");
const router = express.Router()

router.use('/v2/api', require('./test'))
router.use('/v1/api/shop', require('./access'))
router.use('/v1/api/product', require('./product'))

module.exports = router;