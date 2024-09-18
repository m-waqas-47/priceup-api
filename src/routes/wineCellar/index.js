const express = require("express");
const glassTypesRouter = require("@routes/wineCellar/glassTypes");
const hardwaresRouter = require("@routes/wineCellar/hardwares");
const finishesRouter = require("@routes/wineCellar/finishes");
const hardwareCategoriesRouter = require("@routes/wineCellar/hardwareCategory");
const layoutsRouter = require("@routes/wineCellar/layouts");

const router = express.Router();

router.use("/glassTypes", glassTypesRouter);
router.use("/hardwares", hardwaresRouter);
router.use("/finishes", finishesRouter);
router.use("/hardwareCategory", hardwareCategoriesRouter);
router.use("/layouts", layoutsRouter);

module.exports = router;
