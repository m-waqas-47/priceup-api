const express = require("express");
const {
  save,
  get,
  getAll,
  update,
  deleteOptions,
  addOptions,
  deleteEntity,
  modifyExistingRecords,
} = require("@controllers/mirror/glassAddon");
const { verifyToken } = require("@middlewares/authentication");
const { upload } = require("@services/multer");
const router = express.Router();

router.get("/", verifyToken, getAll);
router.put("/modifyExisting", modifyExistingRecords); // run only once to update existing documents
router.get("/:id", verifyToken, get);
router.put("/:id", verifyToken, upload.single("image"), update);
router.delete("/:id/:optionId", verifyToken, deleteOptions);
router.patch("/:id", verifyToken, addOptions);
router.delete("/:id", verifyToken, deleteEntity);
router.post("/save", verifyToken, upload.single("image"), save);

module.exports = router;
