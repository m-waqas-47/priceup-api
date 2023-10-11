const express = require("express");
const {
  saveHardware,
  getHardware,
  getAll,
  getHardwaresByCategory,
  updateHardware,
  deleteHardware,
  deleteHardwareFinishes,
  addHardwareFinishes,
} = require("../controllers/hardware");
const { verifyToken } = require("../middlewares/authentication");
const router = express.Router();
const {updateHardwares,uploadHardware} = require('../utils/multer')

router.get("/", verifyToken, getAll);
router.get("/:id", verifyToken, getHardware);
router.put("/:id",updateHardwares.single("image"), verifyToken, updateHardware);
router.delete("/:id/:finishItemId", verifyToken, deleteHardwareFinishes);
router.patch("/:id", verifyToken, addHardwareFinishes);
router.delete("/:id", verifyToken, deleteHardware);
router.get("/category/:slug", verifyToken, getHardwaresByCategory);
router.post("/save",uploadHardware.single("image"), verifyToken, saveHardware);

module.exports = router;
