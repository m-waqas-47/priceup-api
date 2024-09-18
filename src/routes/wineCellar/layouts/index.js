const express = require("express");
const {
    save,
    getSingle,
    getAll,
    update,
    deleteRecord,
    updateExistingCollection,
    getAllLayoutsForEstimate
} = require("@controllers/wineCellar/layout");
const { verifyToken } = require("@middlewares/authentication");
const router = express.Router();

router.get("/", verifyToken, getAll);
router.get("/for-estimate", verifyToken, getAllLayoutsForEstimate);
router.get("/:id", verifyToken, getSingle);
router.put("/modifyExisting", updateExistingCollection);  // run only once to update previous documents
router.put("/:id", verifyToken, update);
router.delete("/:id", verifyToken, deleteRecord);
router.post("/save", verifyToken, save);

module.exports = router;
