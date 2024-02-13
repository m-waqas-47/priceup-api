const express = require("express");
const {
  saveStaff,
  getStaff,
  getAll,
  updateStaff,
  deleteStaff,
  loginStaff,
  getAllStaff,
  giveAccessToExisting,
  haveAccessTo,
  switchLocation,
  updateTeamPassword,
} = require("../controllers/staff");
const { verifyToken } = require("../middlewares/authentication");
const { upload } = require("../services/multer");
const router = express.Router();




router.get("/", verifyToken, getAll);
router.get("/allStaff", verifyToken, getAllStaff);
router.put("/giveAccess", verifyToken, giveAccessToExisting); // only run once to give access to existing records
router.get("/haveAccess/:id", verifyToken, haveAccessTo);
router.get("/:id", verifyToken, getStaff);
router.put("/updatePassword/:id", verifyToken, updateTeamPassword);
router.put("/:id", verifyToken, upload.single("image"), updateStaff);
router.delete("/:id", verifyToken, deleteStaff);
router.post("/save", verifyToken, upload.single("image"), saveStaff);
router.post("/switchLocation", verifyToken, switchLocation);
router.post("/login", loginStaff);
module.exports = router;
