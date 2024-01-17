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
} = require("../controllers/hardware");
const { verifyToken } = require("../middlewares/authentication");
const { upload } = require("../services/multer");
const router = express.Router();

router.get("/", verifyToken, getAll);
router.get("/:id", verifyToken, getHardware);
router.put("/existingHardware", updateExistingHardware);
router.put("/:id", upload.single("image"), verifyToken, updateHardware);
router.delete("/:id/:finishItemId", verifyToken, deleteHardwareFinishes);
router.patch("/:id", verifyToken, addHardwareFinishes);
router.delete("/:id", verifyToken, deleteHardware);
router.get("/category/:slug", verifyToken, getHardwaresByCategory);
router.post("/save", upload.single("image"), verifyToken, saveHardware);

module.exports = router;
