const express = require("express");
const {
  getAll,
  getSingle,
  update,
  deleteSingle,
  getStats,
  getCustomerPreview,
  updateCustomerPreview,
  save,
} = require("@controllers/invoice");
const { verifyToken } = require("@middlewares/authentication");
const router = express.Router();

router.get("/", verifyToken, getAll);
router.get("/stats", verifyToken, getStats);
router.get("/:id/customer-preview", getCustomerPreview);
router.get("/:id", verifyToken, getSingle);
router.put("/:id/customer-preview", updateCustomerPreview);
router.put("/:id", verifyToken, update);
router.delete("/:id", verifyToken, deleteSingle);
router.post("/save", verifyToken, save);

module.exports = router;
