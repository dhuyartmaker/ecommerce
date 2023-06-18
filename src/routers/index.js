const express = require("express");
const router = express.Router()

router.use('/v2/api', require('./test'))
router.use('/v1/api', require('./access'))

module.exports = router;