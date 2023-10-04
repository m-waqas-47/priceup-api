const express = require("express");
const {
  saveGlassAddon,
  getGlassAddon,
  getAll,
  updateGlassAddon,
  deleteGlassAddonOptions,
  addGlassAddonOptions,
  deleteGlassAddon,
} = require("../controllers/glassAddon");
const { verifyToken } = require("../middlewares/authentication");
const router = express.Router();
const {uploadGlassAddons,updateGlassAddonss} = require('../utils/hardwareMulter')

router.get("/", verifyToken, getAll);
router.get("/:id", verifyToken, getGlassAddon);
router.put("/:id",updateGlassAddonss.single("image"), verifyToken, updateGlassAddon);
router.delete("/:id/:optionId", verifyToken, deleteGlassAddonOptions);
router.patch("/:id", verifyToken, addGlassAddonOptions);
router.delete("/:id", verifyToken, deleteGlassAddon);
router.post("/save",uploadGlassAddons.single("image"), verifyToken, saveGlassAddon);

module.exports = router;
