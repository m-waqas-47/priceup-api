const express = require("express");
const {
  save,
  getSingle,
  getAll,
  update,
  deleteRecord,
  updateExistingCollection
} = require("@controllers/wineCellar/glassType");
const { verifyToken } = require("@middlewares/authentication");
const { upload } = require("@services/multer");
const router = express.Router();

router.get("/", verifyToken, getAll);
router.get("/:id", verifyToken, getSingle);
router.put("/modifyExisting", updateExistingCollection); // run only once to update existing documents
router.put("/:id", verifyToken, upload.single("image"), update);
router.delete("/:id", verifyToken, deleteRecord);
router.post("/save", verifyToken, upload.single("image"), save);

module.exports = router;
