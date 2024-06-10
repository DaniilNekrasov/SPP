const Router = require("express");
const router = new Router();
const controller = require("./EventController");

router.post("/create", controller.createEvent);
router.get("/events", controller.getEvents);
router.delete("/remove", controller.deleteEvent);

module.exports = router;
