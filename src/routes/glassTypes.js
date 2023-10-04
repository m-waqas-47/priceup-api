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
const router = express.Router();
const {uploadGlassType,updateGlassTypes} = require('../utils/hardwareMulter')

router.get("/", verifyToken, getAll);
router.get("/:id", verifyToken, getGlassType);
router.put("/:id",updateGlassTypes.single("image"), verifyToken, updateGlassType);
router.delete("/:id/:optionId", verifyToken, deleteGlassTypeOptions);
router.patch("/:id", verifyToken, addGlassTypeOptions);
router.delete("/:id", verifyToken, deleteGlassType);
router.post("/save",uploadGlassType.single("image"), verifyToken, saveGlassType);

module.exports = router;
