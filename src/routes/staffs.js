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
} = require("../controllers/staff");
const { verifyToken } = require("../middlewares/authentication");
const router = express.Router();

router.get("/", verifyToken, getAll);
router.get("/allStaff", verifyToken, getAllStaff);
router.put("/giveAccess", verifyToken, giveAccessToExisting); // only run once to give access to existing records
router.get("/haveAccess/:id", verifyToken, haveAccessTo);
router.get("/:id", verifyToken, getStaff);
router.put("/:id", verifyToken, updateStaff);
router.delete("/:id", verifyToken, deleteStaff);
router.post("/save", verifyToken, saveStaff);
router.post("/switchLocation", verifyToken, switchLocation);
router.post("/login", loginStaff);
module.exports = router;
