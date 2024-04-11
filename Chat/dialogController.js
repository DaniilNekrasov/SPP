const DBrequest = require("../DB/DB");

class dialogController {
  async getMessages(req, res) {
    try {
      const { dialogId } = req.query;
      const messages = await DBrequest.getMessages(dialogId * 1);
      res.json({ messages });
    } catch (e) {
      res.status(400).json({ message: e });
    }
  }
  async getDialogs(req, res) {
    try {
      const { userId } = req.query;
      const dialogs = await DBrequest.getDialogs(userId * 1);
      res.json({ dialogs });
    } catch (e) {
      res.status(400).json({ message: e });
    }
  }
  async sendMessage(req, res) {
    try {
      const { chatId, senderId, text } = req.body.message;
      const date = new Date(Date.now()).toISOString();
      await DBrequest.sendMessage(chatId, senderId, text, date);
    } catch (e) {
      res.status(400).json({ message: e });
    }
  }
  async createDialog(req, res) {
    try {
      const { id1, id2 } = req.body;
      const dialog = await DBrequest.createDialog(id1, id2);
      res.json(dialog);
    } catch (e) {
      res.status(400).json({ message: e });
    }
  }
}

module.exports = new dialogController();
