const DBrequest = require("../DB/DB");

class EventController {
  async getEvents(req, res) {
    try {
      const { userId } = req.query;
      const events = await DBrequest.getEvents(userId * 1);
      res.json({ events });
    } catch (e) {
      res.status(400).json({ message: e });
    }
  }
  async createEvent(req, res) {
    try {
      const { userId, event } = req.body;
      const result = await DBrequest.createEvent(userId, event);
      res.json(result);
    } catch (e) {
      res.status(400).json({ message: e });
    }
  }
}

module.exports = new EventController();
