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
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const profileUpload = multer({ storage: profileStorage });

const postUpload = multer({ storage: postStorage });

router.put("/status", controller.updateStatus);
router.get("/status", controller.getStatus);
router.get("/user", controller.getProfile);
router.get("/posts", controller.getPosts);
router.delete("/posts", controller.deletePost);
router.post("/posts", postUpload.array("files"), controller.createPost);
router.get("/subscribes", controller.getSubscribes);
router.get("/subscribers", controller.getSubscribers);
router.post("/photo", profileUpload.single("image"), controller.savePhoto);

module.exports = router;
