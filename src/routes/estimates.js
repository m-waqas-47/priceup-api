const express = require("express");
const {
  saveEstimate,
  getEstimate,
  getAll,
  updateEstimate,
  deleteEstimate,
  // getEstimateListsData,
  modifyExistingRecords,
  getAllStats,
  getEstimatesByProject,
  getEstimatesByCustomer
} = require("../controllers/estimate");
const { verifyToken } = require("../middlewares/authentication");
const router = express.Router();

router.get("/", verifyToken, getAll);
router.get("/allStats", verifyToken, getAllStats);
router.get("/by-project/:projectId", verifyToken, getEstimatesByProject);
router.get("/by-customer/:id", verifyToken, getEstimatesByCustomer);
// router.get("/listsData", verifyToken, getEstimateListsData);
router.put("/modifyExisting", modifyExistingRecords); // run only once to update existing documents
router.get("/:id", verifyToken, getEstimate);
router.put("/:id", verifyToken, updateEstimate);
router.delete("/:id", verifyToken, deleteEstimate);
router.post("/save", verifyToken, saveEstimate);

module.exports = router;
