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
const upload = require("../utils/multer");
const {uploadHardware} = require('../utils/hardwareMulter')

router.get("/", verifyToken, getAll);
router.get("/:id", verifyToken, getHardware);
router.put("/:id",uploadHardware.single("image"), verifyToken, updateHardware);
router.delete("/:id/:finishItemId", verifyToken, deleteHardwareFinishes);
router.patch("/:id", verifyToken, addHardwareFinishes);
router.delete("/:id", verifyToken, deleteHardware);
router.get("/category/:slug", verifyToken, getHardwaresByCategory);
router.post("/save",upload.single("image"), verifyToken, saveHardware);

module.exports = router;
