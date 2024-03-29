const express = require("express");
const { loginUser } = require("../controllers/authentication");
const router = express.Router();

router.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send("Backend Server Running");
});
router.post("/login", loginUser);

module.exports = router;
