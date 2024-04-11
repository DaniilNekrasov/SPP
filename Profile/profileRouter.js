const Router = require("express");
const router = new Router();
const controller = require("./profileController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Папка для сохранения загруженных файлов
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Используем оригинальное имя файла
  },
});

const upload = multer({ storage });

router.put("/status", controller.updateStatus);
router.get("/status", controller.getStatus);
router.get("/user", controller.getProfile);
router.get("/posts", controller.getPosts);
router.delete("/posts", controller.deletePost);
router.post("/posts", controller.createPost);
router.get("/subscribes", controller.getSubscribes);
router.get("/subscribers", controller.getSubscribers);
router.post("/photo", upload.single("image"), controller.savePhoto);

module.exports = router;
