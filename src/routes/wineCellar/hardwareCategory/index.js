const express = require("express");
const {
    save,
    getSingle,
    getAll,
    updateExistingCollection
} = require("@controllers/wineCellar/hardwareCategory");
const { verifyToken } = require("@middlewares/authentication");
const router = express.Router();

router.get("/", verifyToken, getAll);
router.get("/:id", verifyToken, getSingle);
router.put("/modifyExisting", updateExistingCollection); // run only once to update existing documents
router.post("/save", verifyToken, save);

module.exports = router;
