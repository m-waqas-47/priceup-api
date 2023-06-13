const express = require("express");
const {
  saveLayout,
  getLayout,
  getAll,
  updateLayout,
  deleteLayout,
} = require("../controllers/layout");
const { verifyToken } = require("../middlewares/authentication");
const router = express.Router();

router.get("/", verifyToken, getAll);
router.get("/:id", verifyToken, getLayout);
router.put("/:id", verifyToken, updateLayout);
router.delete("/:id", verifyToken, deleteLayout);
router.post("/save", verifyToken, saveLayout);

module.exports = router;
