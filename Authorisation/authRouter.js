const Router = require('express')
const router = new Router()
const controller = require('./authController')
const authMiddleware = require("../Middleware/authMiddleware")

router.post('/registration', controller.registration)
router.post('/login', controller.login)
router.get('/users', controller.getUsers) //Middleware

module.exports = router