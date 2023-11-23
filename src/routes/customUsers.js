const express = require("express");
const {
  saveUser,
  getUser,
  getAll,
  updateUser,
  deleteUser,
} = require("../controllers/customUser");
const { verifyToken } = require("../middlewares/authentication");
const router = express.Router();

router.get("/", verifyToken, getAll);
router.get("/:id", verifyToken, getUser);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.post("/save", verifyToken, saveUser);

module.exports = router;
