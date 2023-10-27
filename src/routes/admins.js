const express = require("express");
const {
  getAll,
  loginAdmin,
  saveAdmin,
  loginAdminById,
  loginAdminByIdAgain,
  allLocations
} = require("../controllers/admin");
const { verifyToken } = require("../middlewares/authentication");
const router = express.Router();

router.get("/", verifyToken, getAll);
router.get("/allLocations",verifyToken, allLocations);
router.post("/loginAdminId", verifyToken, loginAdminById);
router.post("/loginAdminIdAgain", verifyToken, loginAdminByIdAgain);
router.post("/login", loginAdmin);
router.post("/save", saveAdmin);
module.exports = router;
