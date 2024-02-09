const express = require("express");
const {
  saveGlassType,
  getGlassType,
  getAll,
  updateGlassType,
  deleteGlassTypeOptions,
  addGlassTypeOptions,
  deleteGlassType,
} = require("../controllers/glassType");
const { verifyToken } = require("../middlewares/authentication");
const { upload } = require("../services/multer");
const router = express.Router();

router.get("/", verifyToken, getAll);
router.get("/:id", verifyToken, getGlassType);
router.put("/:id", verifyToken, upload.single("image"), updateGlassType);
router.delete("/:id/:optionId", verifyToken, deleteGlassTypeOptions);
router.patch("/:id", verifyToken, addGlassTypeOptions);
router.delete("/:id", verifyToken, deleteGlassType);
router.post("/save", verifyToken, upload.single("image"), saveGlassType);

module.exports = router;
