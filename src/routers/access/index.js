const express = require("express");
const AccesController = require("../../controllers/access.controller");
const { apiKey, permission } = require("../../auth/checkAuth");
const { authenticate } = require("../../auth/authUtil");
const router = express.Router()

// router.use(apiKey)
// router.use(permission('Permission!!'))

router.post('/signup', AccesController.signUp)
router.post('/signin', AccesController.signIn)

router.use(authenticate)
router.post('/signout', AccesController.signOut)

module.exports = router;