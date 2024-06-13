const { PrismaClient } = require("@prisma/client");
const DBrequest = require("../DB/DB");
const client = new PrismaClient();

const findUser = async (id) => {
  await client.$connect();
  try {
    return await client.user.findUnique({ where: { id: id * 1 } });
  } catch (error) {
    console.error("Error finding user:", error);
    throw error;
  } finally {
    await client.$disconnect();
  }
};

class ProfileController {
  async updateStatus(req, res) {
    try {
      const { id, status } = req.body;
      const candidate = await findUser(id);
      if (!candidate) {
        return res.status(400).json({ message: "Profile doesnt exist" });
      }
      await client.user.update({ where: { id: id }, data: { status: status } });
      return res.json({ message: "success" });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: e });
    }
  }

  async getStatus(req, res) {
    try {
      const userId = req.query.userId;
      const candidate = await findUser(userId * 1);
      if (!candidate) {
        return res.status(400).json({ message: "Profile doesnt exist" });
      }
      res.json(candidate.status);
    } catch (e) {
      console.log("status error");
      res.status(400).json({ message: e });
    }
  }

  async getProfile(req, res) {
    try {
      const userId = req.query.userId;
      const candidate = await findUser(userId * 1);
      if (!candidate) {
        return res.status(400).json({ message: "Profile doesnt exist" });
      }
      res.json(candidate);
    } catch (e) {
      console.log("getting profile error");
      res.status(400).json({ message: e });
    }
  }

  async createPost(req, res) {
    try {
      const userId = req.query.userId;
      const { authors, title, content, date, keywords } = req.body;
      const { files } = req;
      const candidate = await findUser(authors[0] * 1);
      if (!candidate) {
        return res.status(400).json({ message: "Profile doesnt exist" });
      }
      let post = await DBrequest.createPost(
        authors,
        content,
        date,
        title,
        keywords
      );
      for (const file of files) {
        DBrequest.saveFiles(post.id, file);
      }
      let posts = await DBrequest.getPosts(userId * 1);
      res.json(posts);
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: e });
    }
  }

  async deletePost(req, res) {
    try {
      let { postId } = req.query;
      await DBrequest.deleteFiles(postId * 1);
      await DBrequest.deletePost(postId * 1);
      res.json({ message: "success" });
    } catch (e) {
      console.log("deleting post error");
      res.status(400).json({ message: e });
    }
  }

  async getPosts(req, res) {
    try {
      const { userId } = req.query;
      const candidate = await findUser(userId * 1);
      if (!candidate) {
        return res.status(400).json({ message: "Profile doesnt exist" });
      }
      let posts = await DBrequest.getPosts(userId * 1);
      res.json(posts);
    } catch (e) {
      console.log("getting post error");
      res.status(400).json({ message: e });
    }
  }

  async getSubscribes(req, res) {
    try {
      const { userId } = req.query;
      const candidate = await findUser(userId * 1);
      if (!candidate) {
        return res.status(400).json({ message: "Profile doesnt exist" });
      }
      let subscribes = await DBrequest.getSubscribes(userId * 1);
      res.json(subscribes);
    } catch (e) {
      console.log("Getting subscibes error " + e);
      res.status(400).json({ message: e });
    }
  }

  async getSubscribers(req, res) {
    try {
      const { userId } = req.query;
      const candidate = await findUser(userId * 1);
      if (!candidate) {
        return res.status(400).json({ message: "Profile doesnt exist" });
      }
      let subscribers = await DBrequest.getSubscribers(userId * 1);
      res.json(subscribers);
    } catch (e) {
      console.log("getting subscibers error: " + e);
      res.status(400).json({ message: e });
    }
  }

  async savePhoto(req, res) {
    try {
      const { userId } = req.body;
      const { file } = req;
      const candidate = await findUser(userId * 1);
      if (!candidate) {
        return res.status(400).json({ message: "Profile doesnt exist" });
      }
      await DBrequest.savePhoto(file.path, userId * 1);
      res.json({ candidate, message: "success" });
    } catch (e) {
      console.log("getting photo error " + e);
      res.status(400).json({ message: e });
    }
  }
  async updateInfo(req, res) {
    try {
      let { work, awards, education, userId } = req.body;
      const candidate = await findUser(userId * 1);
      if (!candidate) {
        return res.status(400).json({ message: "Profile doesnt exist" });
      }
      await DBrequest.updateInfo(work, awards, education, userId * 1);
      res.json({ message: "success" });
    } catch (e) {
      console.log("Updating info error " + e);
      res.status(400).json({ message: e });
    }
  }

  async updateRate(req, res) {
    try {
      let { rate, postId, userId } = req.body;
      rate === 1 ? (rate = true) : rate === 0 ? (rate = null) : (rate = false);
      const candidate = await findUser(userId * 1);
      if (!candidate) {
        return res.status(400).json({ message: "Profile doesnt exist" });
      }
      await DBrequest.updateRate(rate, postId, userId);
      res.json({ message: "Rate added successfully" });
    } catch (e) {
      console.log("getting photo error " + e);
      res.status(400).json({ message: e });
    }
  }
  async addComment(req, res) {
    try {
      let { text, postId, userId } = req.body;
      const candidate = await findUser(userId * 1);
      if (!candidate) {
        return res.status(400).json({ message: "Profile doesnt exist" });
      }
      await DBrequest.addComment(text, postId, userId);
      res.json({ message: "Comment added successfully" });
    } catch (e) {
      console.log("comment creation error " + e);
      res.status(400).json({ message: e });
    }
  }
}

module.exports = new ProfileController();
