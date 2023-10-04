const express = require("express");
const {
  saveFinish,
  getFinish,
  getAll,
  deleteFinish,
  updateFinish,
} = require("../controllers/finish");
const { verifyToken } = require("../middlewares/authentication");
const router = express.Router();
const upload = require("../utils/multer");

router.get("/", verifyToken, getAll);
router.get("/:id", verifyToken, getFinish);
router.post("/save",upload.single("image"), verifyToken, saveFinish);
router.delete("/:id", verifyToken, deleteFinish);
router.put("/:id",upload.single("image"), verifyToken, updateFinish);

module.exports = router;
