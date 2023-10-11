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
const {updateFinsih,uploadFinish} = require("../utils/multer");

router.get("/", verifyToken, getAll);
router.get("/:id", verifyToken, getFinish);
router.post("/save",uploadFinish.single("image"), verifyToken, saveFinish);
router.delete("/:id", verifyToken, deleteFinish);
router.put("/:id",updateFinsih.single("image"), verifyToken, updateFinish);

module.exports = router;
