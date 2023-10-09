const express = require("express");
const { getAll, loginAdmin, saveAdmin,loginAdminById } = require("../controllers/admin");
const { verifyToken } = require("../middlewares/authentication");
const router = express.Router();

router.get("/", verifyToken, getAll);
router.post("/loginAdminId", verifyToken, loginAdminById);
router.post("/login", loginAdmin);
router.post("/save", saveAdmin);
module.exports = router;
