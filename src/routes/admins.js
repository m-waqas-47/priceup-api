const express = require("express");
const {
  getAll,
  // loginAdmin,
  saveAdmin,
  loginAdminById,
  loginAdminByIdAgain,
  allLocations,
  updateAdmin,
  deleteAdmin,
  updateAdminPassword,
} = require("../controllers/admin");
const { verifyToken } = require("../middlewares/authentication");
const { upload } = require("../services/multer");
const router = express.Router();

router.get("/", verifyToken, getAll);
router.get("/allLocations", verifyToken, allLocations);
router.put("/updatePassword/:id", verifyToken, updateAdminPassword);
router.put("/:id", verifyToken, upload.single("image"), updateAdmin);
router.delete("/:id", verifyToken, deleteAdmin);
router.post("/loginAdminId", verifyToken, loginAdminById);
router.post("/loginAdminIdAgain", verifyToken, loginAdminByIdAgain);
// router.post("/login", loginAdmin);
router.post("/save",verifyToken, upload.single("image"), saveAdmin);
module.exports = router;
