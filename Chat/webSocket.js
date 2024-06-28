const { Server } = require("socket.io");
const express = require("express");
const http = require("http");
const cors = require("cors");

function startSocketServer() {
  const app = express();
  const server = http.createServer(app);

  // CORS middleware configuration
  const corsOptions = {
    origin: "http://localhost:3000", // Replace with your client's origin
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  };

  app.use(cors(corsOptions));

  const io = new Server(server, {
    cors: corsOptions,
  });

  console.log("Server started on 3002");

  io.on("connection", (socket) => {
    console.log("New connection established");

    // Example of joining a room
    socket.on("joinRoom", (chatId) => {
      socket.join(chatId * 1);
      console.log(`Socket ${socket.id} joined room ${chatId}`);
    });

    socket.on("message", (message) => {
      message = JSON.parse(message);
      switch (message.event) {
        case "message":
          io.to(message.chatId * 1).emit("message", JSON.stringify(message));
          break;
        case "connection":
          console.log("User " + message.userId + " connected");
          break;
      }
    });

    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${reason}`);
    });
  });

  server.listen(3002, () => {
    console.log("Server started on port 3002");
  });
}

module.exports = { startSocketServer };
