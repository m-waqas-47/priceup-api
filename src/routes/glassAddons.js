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

router.get("/", verifyToken, getAll);
router.get("/:id", verifyToken, getGlassAddon);
router.put("/:id", verifyToken, updateGlassAddon);
router.delete("/:id/:optionId", verifyToken, deleteGlassAddonOptions);
router.patch("/:id", verifyToken, addGlassAddonOptions);
router.delete("/:id", verifyToken, deleteGlassAddon);
router.post("/save", verifyToken, saveGlassAddon);

module.exports = router;
