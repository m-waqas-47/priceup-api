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
const { upload } = require("../services/multer");

router.get("/", verifyToken, getAll);
router.get("/:id", verifyToken, getFinish);
router.post("/save", verifyToken, upload.single("image"), saveFinish);
router.delete("/:id", verifyToken, deleteFinish);
router.put("/:id", verifyToken, upload.single("image"), updateFinish);

module.exports = router;
