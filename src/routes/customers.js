const express = require("express");
const {
  saveCustomer,
  getCustomer,
  getAll,
  modifyExistingRecords,
  updateCustomer
} = require("../controllers/customer");
const { verifyToken } = require("../middlewares/authentication");
const { upload } = require("../services/multer");
const router = express.Router();

router.get("/", verifyToken, getAll);
router.put("/modifyExisting", verifyToken, modifyExistingRecords); // run only once to update existing documents
router.put("/:id", verifyToken, upload.single("image"), updateCustomer);
router.get("/:id", verifyToken, getCustomer);
router.post("/save", verifyToken, saveCustomer);

module.exports = router;
