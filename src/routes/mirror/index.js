
const express = require("express");
const glassTypesRouter = require("@routes/mirror/glassTypes");
const edgeWorksRouter = require("@routes/mirror/edgeWorks");
const router = express.Router();

router.use("/glassTypes", glassTypesRouter);
router.use("/edgeWorks", edgeWorksRouter);
module.exports = router;
