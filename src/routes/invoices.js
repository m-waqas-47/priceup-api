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
  updateExistingHardware,
  getShowersHardware,
  getMirrorsHardware,
  getWineCellarsHardware
} = require("@controllers/hardware");
const { verifyToken } = require("@middlewares/authentication");
const { upload } = require("@services/multer");
const router = express.Router();

router.get("/", verifyToken, getAll);
router.get("/:id", verifyToken, getSingle);
router.put("/:id", verifyToken, update);
router.delete("/:id", verifyToken, deleteHardware);
router.get("/category/:slug", verifyToken, getHardwaresByCategory);
router.post("/save", upload.single("image"), verifyToken, saveHardware);

module.exports = router;
