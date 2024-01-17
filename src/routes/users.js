const express = require("express");
const {
  saveUser,
  getUser,
  getAll,
  updateUser,
  loginUser,
  updateUserStatus,
  getDashboardTotals,
  getQuote,
  deleteUser,
} = require("../controllers/user");
const { verifyToken } = require("../middlewares/authentication");
const { upload } = require("../services/multer");
const router = express.Router();

router.get("/getQuote/:id", verifyToken, getQuote);
router.get("/", verifyToken, getAll);
router.get("/dashboardData", verifyToken, getDashboardTotals);
router.get("/:id", verifyToken, getUser);
router.put("/:id", verifyToken, upload.single("image"), updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.post("/save", verifyToken, saveUser);
router.put("/status/:id", verifyToken, updateUserStatus);
router.post("/login", loginUser);

module.exports = router;
