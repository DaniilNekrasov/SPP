const webSocket = require("ws");
const { Server } = require("socket.io");

function startSocketServer() {
  const server = new webSocket.Server(
    {
      port: 3002,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    },
    () => console.log("Server started on 3002")
  );

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", async (socket) => {
    console.log("qweqweqweqweqweqwe");
    socket.join(socket.chatId);
    socket.on("message", async (message) => {
      message = JSON.parse(message);
      switch (message.event) {
        case "message":
          io.to(message.chatId).emit(JSON.stringify(message));
          break;
        case "connection":
          console.log("User " + message.userId + " connected");
          break;
      }
    });
    socket.onclose = (event) => {
      console.log(event.reason);
    };
  });
}

module.exports = { startSocketServer };
