const express = require("express");
const AccesController = require("../../controllers/access.controller");
const { apiKey, permission } = require("../../auth/checkAuth");
const { authenticate } = require("../../auth/authUtil");
const router = express.Router()

// router.use(apiKey)
// router.use(permission('Permission!!'))

router.post('/shop/signup', AccesController.signUp)
router.post('/shop/signin', AccesController.signIn)

router.use(authenticate)
router.post('/shop/signout', AccesController.signOut)

module.exports = router;