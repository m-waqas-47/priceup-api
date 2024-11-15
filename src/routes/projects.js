const express = require("express");
const {
  saveRecord,
  getSingleRecord,
  getAll,
  updateRecord,
  deleteRecord,
  getAllStats,
  getCustomerProjects,
  getProjectAllEstimates,
  modifyExistingDocuments
  // getEstimatesByProjectAndCategory
} = require("../controllers/project");
const { verifyToken } = require("../middlewares/authentication");
const { createInvoicePreview } = require("@controllers/customerInvoicePreview");
const router = express.Router();

router.get("/", verifyToken, getAll);
router.get("/allStats", verifyToken, getAllStats);
router.get("/by-customer/:id", verifyToken, getCustomerProjects);
router.get("/all-estimate/:id", verifyToken, getProjectAllEstimates);
router.get("/:id", getSingleRecord);
router.put("/modifyExisting",modifyExistingDocuments); // run only once to update existing documents
router.put("/:id", verifyToken, updateRecord);
router.delete("/:id", verifyToken, deleteRecord);
router.post("/generate-preview", verifyToken, createInvoicePreview)
router.post("/save", verifyToken, saveRecord);

module.exports = router;
