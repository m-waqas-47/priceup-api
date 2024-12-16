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
const { createLandingPagePreview, getLandingPagePreview, updateLandingPagePreview, getAllLandingPagePreview, deleteLandingPagePreview } = require("@controllers/landingPagePreview");
const router = express.Router();

router.get("/", verifyToken, getAll);
router.get("/allStats", verifyToken, getAllStats);
router.get("/by-customer/:id", verifyToken, getCustomerProjects);
router.get("/all-estimate/:id", verifyToken, getProjectAllEstimates);
router.get("/all-landing-page-preview/:id", verifyToken, getAllLandingPagePreview);
router.get("/landing-page-preview/:id", verifyToken, getLandingPagePreview);
router.get("/:id", verifyToken, getSingleRecord);
router.put("/modifyExisting",modifyExistingDocuments); // run only once to update existing documents
router.put("/landing-page-preview/:id", verifyToken, updateLandingPagePreview);
router.put("/:id", verifyToken, updateRecord);
router.delete("/landing-page-preview/:id", verifyToken, deleteLandingPagePreview);
router.delete("/:id", verifyToken, deleteRecord);
router.post("/landing-page-preview", verifyToken, createLandingPagePreview);
router.post("/save", verifyToken, saveRecord);

module.exports = router;
