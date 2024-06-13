const express = require("express");
const glassTypesRouter = require("@routes/mirror/glassTypes");
const edgeWorksRouter = require("@routes/mirror/edgeWorks");
const hardwaresRouter = require("@routes/mirror/hardwares");
const glassAddonsRouter = require("@routes/mirror/glassAddons");

const router = express.Router();

router.use("/glassTypes", glassTypesRouter);
router.use("/edgeWorks", edgeWorksRouter);
router.use("/hardwares", hardwaresRouter);
router.use("/glassAddons", glassAddonsRouter);

module.exports = router;
