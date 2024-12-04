const express = require("express");
const {
  getAll,
  // loginAdmin,
  saveAdmin,
  switchLocation,
  switchBackToSuperView,
  allLocations,
  updateAdmin,
  deleteAdmin,
  updateAdminPassword,
  getAllUsers,
  deleteUser,
  saveUser,
  updateUser,
  updateUserPassword,
  getDashboardStats,
} = require("@controllers/admin");
const { verifyToken } = require("../middlewares/authentication");
const { upload } = require("../services/multer");
const router = express.Router();

router.get("/", verifyToken, getAll);
router.get("/dashbaord-stats", getDashboardStats)
router.get("/all-users", verifyToken, getAllUsers);
router.get("/allLocations", verifyToken, allLocations);
router.put("/user/updatePassword/:id", verifyToken, updateUserPassword);
router.put("/updatePassword/:id", verifyToken, updateAdminPassword);
router.put("/user/:id", verifyToken, upload.single("image"), updateUser);
router.put("/:id", verifyToken, upload.single("image"), updateAdmin);
router.delete("/user/:id", verifyToken, deleteUser);
router.delete("/:id", verifyToken, deleteAdmin);
router.post("/user/save", verifyToken, upload.single("image"), saveUser);
router.post("/switchLocation", verifyToken, switchLocation);
router.post("/switchBackToSuperView", verifyToken, switchBackToSuperView);
// router.post("/login", loginAdmin);
router.post("/save", verifyToken, upload.single("image"), saveAdmin);
module.exports = router;
