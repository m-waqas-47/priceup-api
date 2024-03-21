const express = require("express");
const {
  saveUser,
  getUser,
  getAll,
  updateUser,
  deleteUser,
  haveAccessTo,
  switchLocation,
  giveAccessToExisting,
  updateUserPassword,
  switchBackToSuperView
} = require("../controllers/customUser");
const { verifyToken } = require("../middlewares/authentication");
const { upload } = require("../services/multer");
const router = express.Router();

router.get("/", verifyToken, getAll);
router.put("/giveAccess", verifyToken, giveAccessToExisting); // only run once to give access to existing records
router.get("/haveAccess/:id", verifyToken, haveAccessTo);
router.get("/:id", verifyToken, getUser);
router.put("/updatePassword/:id", verifyToken, updateUserPassword);
router.put("/:id", verifyToken, upload.single("image"), updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.post("/save", verifyToken, upload.single("image"), saveUser);
router.post("/switchLocation", verifyToken, switchLocation);
router.post("/switchBackToSuperView", verifyToken, switchBackToSuperView);

 
module.exports = router;
