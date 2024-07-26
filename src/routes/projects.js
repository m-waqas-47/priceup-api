const express = require("express");
const {
  saveRecord,
  getSingleRecord,
  getAll,
  updateRecord,
  deleteRecord,
  getAllStats,
  getEstimatesByProjectAndCategory
} = require("../controllers/project");
const { verifyToken } = require("../middlewares/authentication");
const router = express.Router();

router.get("/", verifyToken, getAll);
router.get("/allStats", verifyToken, getAllStats);
router.get("/:id", verifyToken, getSingleRecord);
router.put("/:id", verifyToken, updateRecord);
router.delete("/:id", verifyToken, deleteRecord);
router.post("/save", verifyToken, saveRecord);

module.exports = router;
