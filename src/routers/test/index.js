const express = require("express");
const TestController = require("../../controllers/test.controller");
const router = express.Router()

router.post('/test', TestController.signUp)

module.exports = router;