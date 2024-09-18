const express = require("express");
const {
  saveCompany,
  getCompany,
  getAll,
  updateCompany,
  deleteCompany,
  cloneCompany,
  getAllByUserRole
} = require("../controllers/company");
const { verifyToken } = require("../middlewares/authentication");
const { upload } = require("../services/multer");
const router = express.Router();

router.get("/", verifyToken, getAll);
router.get("/by-role", verifyToken, getAllByUserRole);
router.get("/:id", verifyToken, getCompany);
router.put("/:id", verifyToken, upload.single("image"), updateCompany);
router.delete("/:id", verifyToken, deleteCompany);
router.post("/save", verifyToken, saveCompany);
router.post("/clone", verifyToken, upload.single("image"), cloneCompany);

module.exports = router;
