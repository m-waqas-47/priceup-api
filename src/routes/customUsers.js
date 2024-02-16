const express = require("express");
const {
  saveUser,
  getUser,
  getAll,
  updateUser,
  deleteUser,
  haveAccessTo,
  switchLocation,
  updateCustomUserPassword,
} = require("../controllers/customUser");
const { verifyToken } = require("../middlewares/authentication");
const { upload } = require("../services/multer");
const router = express.Router();

router.get("/", verifyToken, getAll);
router.get("/haveAccess/:id", verifyToken, haveAccessTo);
router.get("/:id", verifyToken, getUser);
router.put("/updatePassword/:id", verifyToken, updateCustomUserPassword);
router.put("/:id", verifyToken, upload.single("image"), updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.post("/save", verifyToken, upload.single("image"), saveUser);
router.post("/switchLocation", verifyToken, switchLocation);

module.exports = router;
