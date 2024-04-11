const Router = require('express')
const router = new Router()
const controller = require('./subscribeController')

router.post('/follow', controller.follow)
router.post('/unfollow', controller.unfollow)

module.exports = router 