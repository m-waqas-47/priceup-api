const express = require("express");
const {
  saveEdgeWork,
  getEdgeWork,
  getAll,
  updateEdgeWork,
  deleteEdgeWorkOptions,
  addEdgeWorkOptions,
  deleteEdgeWork,
  modifyExistingRecords,
} = require("@controllers/mirror/edgeWork");
const { verifyToken } = require("@middlewares/authentication");
const { upload } = require("@services/multer");
const router = express.Router();

router.get("/", verifyToken, getAll);
router.put("/modifyExisting", modifyExistingRecords); // run only once to update existing documents
router.get("/:id", verifyToken, getEdgeWork);
router.put("/:id", verifyToken, upload.single("image"), updateEdgeWork);
router.delete("/:id/:optionId", verifyToken, deleteEdgeWorkOptions);
router.patch("/:id", verifyToken, addEdgeWorkOptions);
router.delete("/:id", verifyToken, deleteEdgeWork);
router.post("/save", verifyToken, upload.single("image"), saveEdgeWork);

module.exports = router;
