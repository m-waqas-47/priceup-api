const express = require("express");
const {
  saveRecord,
  getSingleRecord,
  getAll,
  updateRecord,
  deleteRecord,
  getAllStats,
  getCustomerProjects,
  getProjectAllEstimates
  // getEstimatesByProjectAndCategory
} = require("../controllers/project");
const { verifyToken } = require("../middlewares/authentication");
const { createInvoicePreview } = require("@controllers/customerInvoicePreview");
const router = express.Router();

router.get("/", verifyToken, getAll);
router.get("/allStats", verifyToken, getAllStats);
router.get("/by-customer/:id", verifyToken, getCustomerProjects);
router.get("/all-estimate/:id", verifyToken, getProjectAllEstimates);
router.get("/:id", verifyToken, getSingleRecord);
router.put("/:id", verifyToken, updateRecord);
router.delete("/:id", verifyToken, deleteRecord);
router.post("/generate-preview", verifyToken, createInvoicePreview)
router.post("/save", verifyToken, saveRecord);

module.exports = router;
