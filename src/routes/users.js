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
  deleteUser
} = require("../controllers/user");
const { verifyToken } = require("../middlewares/authentication");
const router = express.Router();
const {updateUsers,uploadUsers} = require("../utils/userMulter");

router.get("/getQuote/:id", verifyToken, getQuote);
router.get("/", verifyToken, getAll);
router.get("/dashboardData", verifyToken, getDashboardTotals);
router.get("/:id", verifyToken, getUser);
router.put("/:id",updateUsers.single("image"), verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.post("/save", verifyToken, saveUser);
router.put("/status/:id", verifyToken, updateUserStatus);
router.post("/login", loginUser);

module.exports = router;
