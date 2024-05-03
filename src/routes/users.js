const express = require("express");
const {
  saveUser,
  getUser,
  getAll,
  updateUser,
  // loginUser,
  updateUserStatus,
  getDashboardTotals,
  deleteUser,
  updateUserPassword,
} = require("../controllers/user");
const { verifyToken } = require("../middlewares/authentication");
const { upload } = require("../services/multer");
const router = express.Router();

router.get("/", verifyToken, getAll);
router.get("/dashboardData", verifyToken, getDashboardTotals);
router.get("/:id", verifyToken, getUser);
router.put("/updatePassword/:id", verifyToken, updateUserPassword);
router.put("/:id", verifyToken, upload.single("image"), updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.post("/save", verifyToken, upload.single("image"), saveUser);
router.put("/status/:id", verifyToken, updateUserStatus);
// router.post("/login", loginUser);

module.exports = router;
