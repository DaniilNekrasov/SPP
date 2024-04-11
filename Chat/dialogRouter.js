const Router = require("express");
const router = new Router();
const controller = require("./dialogController");
const authMiddleware = require("../Middleware/authMiddleware");

router.post("/send", controller.sendMessage);
router.post("/createdialog", controller.createDialog);
router.get("/dialogs", controller.getDialogs);
router.get("/messages", controller.getMessages);

module.exports = router;
