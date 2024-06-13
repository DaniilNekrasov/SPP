const Router = require("express");
const router = new Router();
const controller = require("./profileController");
const multer = require("multer");
const path = require("path");

const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile-pics/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const postStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/posts/");
  },
  filename: (req, file, cb) => {
    file.originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const profileUpload = multer({ storage: profileStorage });

const postUpload = multer({ storage: postStorage });

router.put("/status", controller.updateStatus);
router.put("/posts/rate", controller.updateRate);
router.put("/info", controller.updateInfo);
router.get("/status", controller.getStatus);
router.get("/user", controller.getProfile);
router.get("/posts", controller.getPosts);
router.delete("/posts", controller.deletePost);
router.post("/posts", postUpload.array("files"), controller.createPost);
router.post("/comments", controller.addComment);
router.get("/subscribes", controller.getSubscribes);
router.get("/subscribers", controller.getSubscribers);
router.post("/photo", profileUpload.single("image"), controller.savePhoto);

module.exports = router;
