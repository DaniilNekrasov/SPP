const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secret } = require("../config");
const sqlite3 = require("sqlite3").verbose();
const database = new sqlite3.Database("db.sqlite3");
const DBrequest = require("../DB/DB");
const { PrismaClient } = require("@prisma/client");

const client = new PrismaClient();

const generateAccessToken = (id) => {
  const payload = {
    id,
  };
  return jwt.sign(payload, secret, { expiresIn: "24h" });
};

const findUser = async (login) => {
  await client.$connect();
  try {
    return await client.user.findFirst({ where: { login: login } }); //findunique только для уникальных нужно в схеме логин сделать уникальным
  } catch (error) {
    console.error("Error finding user:", error);
    throw error;
  } finally {
    await client.$disconnect();
  }
};

class AuthController {
  async registration(req, res) {
    try {
      const { login, password, email } = req.body;
      const candidate = await findUser(login);
      console.log(candidate);
      if (candidate) {
        return res.json({ message: "This login is already in use" });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      await DBrequest.addUser(login, hashPassword, email);
      const user = await findUser(login);
      const token = generateAccessToken(user.id);
      res.cookie({ token }).json({ user });
    } catch (e) {
      res.status(400).json({ message: e });
    }
  }
  async login(req, res) {
    try {
      const { login, password } = req.body;
      const user = await findUser(login);
      if (!user) {
        return res.status(400).json({ message: "Incorrect login or password" });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        console.error("400");
        return res.status(400).json({ message: "Incorrect login or password" });
      }
      const token = generateAccessToken(user.id);
      res.cookie("token", token, {
        httpOnly: true,
      });
      res.json({ user });
    } catch (e) {
      res.status(400).json({ message: "login error" });
    }
  }
  async getUsers(req, res) {
    try {
      const { page, count } = req.query;
      const users = await DBrequest.getUsers(page, count);
      const pageUsers = users.filter(
        (u, ind) => ind >= (page - 1) * count && ind <= page * count
      );
      res.json({ items: pageUsers, totalCount: users.length });
    } catch (e) {
      res.status(400).json({ message: "getting users error" });
    }
  }
}

module.exports = new AuthController();
