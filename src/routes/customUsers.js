const express = require("express");
const {
  saveUser,
  getUser,
  getAll,
  updateUser,
  deleteUser,
  haveAccessTo,
  switchLocation,
} = require("../controllers/customUser");
const { verifyToken } = require("../middlewares/authentication");
const router = express.Router();

router.get("/", verifyToken, getAll);
router.get("/haveAccess/:id", verifyToken, haveAccessTo);
router.get("/:id", verifyToken, getUser);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.post("/save", verifyToken, saveUser);
router.post("/switchLocation", verifyToken, switchLocation);

module.exports = router;
