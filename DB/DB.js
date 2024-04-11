const { PrismaClient } = require("@prisma/client");
const { idText } = require("typescript");

class DBrequest {
  constructor() {
    this.client = new PrismaClient();
    this.client.$connect();
  }
  async executeQuery(query, errorMessage) {
    try {
      return await query();
    } catch (error) {
      console.error(errorMessage, error);
      throw error;
    }
  }

  async getUsers() {
    return await this.executeQuery(
      () => this.client.user.findMany(),
      "Error getting all users:"
    );
  }

  async getStatus(id) {
    return await this.executeQuery(
      () => this.client.user.findUnique({ where: { id: id } }),
      "Getting status error:"
    );
  }

  async addUser(login, password, email) {
    return this.executeQuery(
      () =>
        this.client.user.create({
          data: {
            login: login,
            password: password,
            status: "",
            email: email,
          },
        }),
      "Error creating user:"
    );
  }

  async addSubscribe(subscriber_id, user_id) {
    return this.executeQuery(
      () =>
        this.client.subscription.create({
          data: { subscriberId: subscriber_id, subscribedToId: user_id },
        }),
      "Creating subscription error"
    );
  }
  async deleteSubscribe(subscriber_id, user_id) {
    return this.executeQuery(
      () =>
        this.client.subscription.deleteMany({
          where: {
            AND: [{ subscriberId: subscriber_id }, { subscribedToId: user_id }],
          },
        }),
      "Deleting subscription error"
    );
  }

  async getPosts(id) {
    return this.executeQuery(
      () => this.client.post.findMany({ where: { authorId: id } }),
      "Getting posts error"
    );
  }
  async deletePost(id) {
    return this.executeQuery(
      () => this.client.post.delete({ where: { id: id } }),
      "Deleting post error"
    );
  }
  async createPost(id, content, date, title) {
    return this.executeQuery(
      () =>
        this.client.post.create({
          data: {
            authorId: id,
            content: content,
            date: date,
            title: title,
          },
        }),
      "Creating post error"
    );
  }
  async getSubscribes(id) {
    return this.executeQuery(
      () => this.client.subscription.findMany({ where: { subscriberId: id } }),
      "Getting subscribes error"
    );
  }
  async getSubscribers(id) {
    return this.executeQuery(
      () =>
        this.client.subscription.findMany({ where: { subscribedToId: id } }),
      "Getting subscribers error"
    );
  }

  async savePhoto(avatarURL, id) {
    return this.executeQuery(() =>
      this.client.user.update({
        where: { id: id },
        data: { avatarURL: avatarURL },
      })
    );
  }

  async getMessages(id) {
    return this.executeQuery(
      () => this.client.message.findMany({ where: { chatId: id } }),
      "Getting messages error"
    );
  }
  async sendMessage(dialogId, senderId, text, date) {
    return this.executeQuery(
      () =>
        this.client.message.create({
          data: {
            chatId: dialogId,
            senderId: senderId,
            text: text,
            date: date,
          },
        }),
      "Sending message error"
    );
  }
  async getDialogs(userId) {
    return this.executeQuery(
      () =>
        this.client.chat.findMany({
          where: {
            user: {
              some: {
                id: userId,
              },
            },
          },
          include: {
            user: {
              where: {
                NOT: { id: userId },
              },
            }, // Включить информацию о пользователях чатов
            message: {
              orderBy: {
                date: "desc",
              },
              take: 1, // Взять только одно последнее сообщение
            },
          },
        }),
      "Getting dialogs error"
    );
  }
  async createDialog(id1, id2) {
    const existingChat = await this.client.chat.findFirst({
      where: {
        AND: [
          { user: { some: { id: id1 } } }, // Пользователь id1 присутствует в чате
          { user: { some: { id: id2 } } }, // Пользователь id2 присутствует в чате
        ],
      },
    });
    if (existingChat) return existingChat;
    return this.executeQuery(
      () =>
        this.client.chat.create({
          data: {
            user: {
              connect: [{ id: id1 }, { id: id2 }],
            },
            message: {
              create: {
                senderId: id1, // Определяем отправителя первым пользователем
                text: "Начало диалога", // Начальное сообщение
                date: new Date(Date.now()).toISOString(),
              },
            },
          },
          include: {
            message: true,
          },
        }),
      "Creating dialog error"
    );
  }
}
module.exports = new DBrequest();

//в начале рефакторинга работы с БД это 229 строка
