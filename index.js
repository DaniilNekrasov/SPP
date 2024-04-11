var expressWs = require("express-ws");
const cors = require("cors");
const express = require("express");
const webSocket = require("ws");
const authRouter = require("./Authorisation/authRouter");
const profileRouter = require("./Profile/profileRouter");
const authMiddleware = require("./Middleware/authMiddleware");
const subscribeRouter = require("./subscription/subscribeRouter");
const dialogRouter = require("./Chat/dialogRouter");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const cookieParser = new require("cookie-parser");

const app = express();
const PORT = 3001;
const jsonBodyMiddleware = express.json();

expressWs(app);
app.use(jsonBodyMiddleware);
app.use(cors());
app.use("/messages", dialogRouter);
app.use("/auth", authRouter);
app.use("/subscription", subscribeRouter);
app.use("/profile", profileRouter);
app.use(cookieParser());

const db = {
  messages: [
    { id: 1, message: "hello", sender: 1 },
    { id: 2, message: "hello", sender: 0 },
    { id: 3, message: "idi delay labu", sender: 1 },
    { id: 4, message: "ok", sender: 0 },
    { id: 5, message: "ok", sender: 1 },
  ],
  users: [],
};

app.get("/posts", (req, res) => {
  try {
    const foundPosts = db.posts; //.filter(c => c.message.indexOf(req.query.message as string) > -1)
    res.json(foundPosts);
  } catch {
    res.sendStatus(500);
  }
});

app.delete("/posts/:id", (req, res) => {
  try {
    db.posts = db.posts.filter((c) => c.id !== +req.params.id);
    res.sendStatus(204);
  } catch {
    res.sendStatus(500);
  }
});

app.get("/posts/:id", (req, res) => {
  const foundPost = db.posts.find((c) => c.id === +req.params.id);

  if (!foundPost) {
    res.sendStatus(404);
    return;
  }

  res.json(foundPost);
});

app.post("/posts", (req, res) => {
  if (!req.body.text) {
    res.sendStatus(400);
    return;
  }
  const newPost = {
    id: +new Date(),
    message: req.body.text,
    likesCount: 0,
  };
  db.posts.push(newPost);
  console.log(result);
  res.json(newPost);
});

app.put("/posts/:id", (req, res) => {
  debugger;
  if (!req.body.message) {
    res.sendStatus(400);
    return;
  }

  const foundPost = db.posts.find((c) => c.id === +req.params.id);

  if (!foundPost) {
    res.sendStatus(404);
    return;
  }

  foundPost.message = req.body.message;

  res.sendStatus(204);
});

app.get("/messages", authMiddleware, (req, res) => {
  try {
    const messages = db.messages;
    res.json(messages);
  } catch {
    res.sendStatus(500);
  }
});

app.post("/messages", authMiddleware, (req, res) => {
  if (!req.body.message) {
    res.sendStatus(400);
    return;
  }
  const newMessage = {
    id: +Date(),
    message: req.body.message,
    sender: 0,
  };
  db.messages.push(newMessage);
  res.json(db.messages);
});

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});

const server = new webSocket.Server(
  {
    port: 3002,
  },
  () => console.log("Server started on 3002")
);

app.get("/user/avatar/:filename", (req, res) => {
  const filename = req.params.filename;
  if (filename) {
    const filePath = path.join(__dirname, "uploads", filename);
    res.sendFile(filePath);
  }
});

server.on("connection", function connection(ws) {
  ws.onclose = (event) => {
    console.log(event.reason);
  };
  ws.on("message", function (message) {
    message = JSON.parse(message);
    switch (message.event) {
      case "message":
        broadcastMessage(message);
        break;
      case "connection":
        console.log("User " + message.userId + " connected");
        break;
    }
  });
});

function broadcastMessage(message) {
  server.clients.forEach((client) => {
    console.log("+");
    client.send(JSON.stringify(message));
  });
}

const message = {
  event: "message/connection",
  id: 123,
  date: "21.01.2023",
  userName: "Danul",
  message: "hello",
};
