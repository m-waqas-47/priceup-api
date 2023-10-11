const express = require("express");
const {
  saveStaff,
  getStaff,
  getAll,
  updateStaff,
  deleteStaff,
  loginStaff,
  getAllStaff
} = require("../controllers/staff");
const { verifyToken } = require("../middlewares/authentication");
const router = express.Router();

router.get("/", verifyToken, getAll);
router.get("/allStaff", verifyToken, getAllStaff);
router.get("/:id", verifyToken, getStaff);
router.put("/:id", verifyToken, updateStaff);
router.delete("/:id", verifyToken, deleteStaff);
router.post("/save", verifyToken, saveStaff);
router.post('/login',loginStaff);
module.exports = router;
