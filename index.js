var expressWs = require("express-ws");
const cors = require("cors");
const express = require("express");
const { startSocketServer } = require("./Chat/webSocket");
const authRouter = require("./Authorisation/authRouter");
const profileRouter = require("./Profile/profileRouter");
const eventRouter = require("./Event/eventRouter");
const subscribeRouter = require("./subscription/subscribeRouter");
const dialogRouter = require("./Chat/dialogRouter");
const path = require("path");
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
app.use("/events", eventRouter);
app.use(cookieParser());
startSocketServer();

// app.all("*", (req, res) => {
//   return handle(req, res);
// });

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});

app.use("/download/:filePath", (req, res) => {
  const filePath = path.join(__dirname, "uploads/posts", req.params.filePath);
  res.download(filePath, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(500).send("Error downloading file");
    }
  });
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/user/avatar/:filename", (req, res) => {
  const filename = req.params.filename;
  if (filename) {
    const filePath = path.join(__dirname, "uploads/profile-pics", filename);
    res.sendFile(filePath);
  }
});
