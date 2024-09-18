const express = require("express");
const {
    save,
    getSingle,
    getAll,
    deleteRecord,
    update,
    updateExistingCollection
} = require("@controllers/wineCellar/finish");
const { verifyToken } = require("@middlewares/authentication");
const router = express.Router();
const { upload } = require("@services/multer");

router.get("/", verifyToken, getAll);
router.get("/:id", verifyToken, getSingle);
router.put("/modifyExisting", updateExistingCollection);
router.put("/:id", verifyToken, upload.single("image"), update);
router.post("/save", verifyToken, upload.single("image"), save);
router.delete("/:id", verifyToken, deleteRecord);

module.exports = router;
