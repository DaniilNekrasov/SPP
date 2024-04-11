const sqlite3 = require("sqlite3").verbose();
const database = new sqlite3.Database("db.sqlite3");
const DBrequest = require("../DB/DB");

class SubscribeController {
  async follow(req, res) {
    try {
      const subscriber_id = req.body.subscriber;
      const user_id = req.body.user;
      await DBrequest.addSubscribe(subscriber_id * 1, user_id * 1);
      res.json({ resultCode: 0 });
    } catch (e) {
      console.log(e);
      res.status(417).json({ message: "Following error" });
    }
  }
  async unfollow(req, res) {
    try {
      const subscriber_id = req.body.subscriber;
      const user_id = req.body.user;
      await DBrequest.deleteSubscribe(subscriber_id * 1, user_id * 1);
      res.json({ resultCode: 0 });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Unfollowing error" });
    }
  }
}

module.exports = new SubscribeController();
