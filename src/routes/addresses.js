const express = require("express");
const {
  saveAddress,
  getAll,
  updateAddress,
  addressesbyCustomer,
} = require("@controllers/address");
const { verifyToken } = require("@middlewares/authentication");
const router = express.Router();

router.get("/", verifyToken, getAll);
router.get("/by-customer/:id", verifyToken, addressesbyCustomer);
router.put("/:id", verifyToken, updateAddress);
router.post("/save", verifyToken, saveAddress);

module.exports = router;
