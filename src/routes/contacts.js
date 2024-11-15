const express = require("express");
const {
  saveRecord,
  // getSingleRecord,
  contactsbyCustomer,
  getAll,
  updateRecord,
  deleteRecord
} = require("../controllers/contact");
const { verifyToken } = require("../middlewares/authentication");
const router = express.Router();

router.get("/", verifyToken, getAll);
router.get("/by-customer/:id", verifyToken, contactsbyCustomer);
// router.get("/:id", getSingleRecord);
router.put("/:id", verifyToken, updateRecord);
router.delete("/:id", verifyToken, deleteRecord);
router.post("/save", verifyToken, saveRecord);

module.exports = router;
