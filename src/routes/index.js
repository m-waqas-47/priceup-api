const express = require("express");
const { loginUser } = require("../controllers/authentication");
const { verifyToken } = require("@middlewares/authentication");
const { getDashboardGraphData, getDashboardStats } = require("@controllers/dashboard");
const router = express.Router();

router.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send("Backend Server Running");
});
router.get("/dashboard-stats", verifyToken, getDashboardStats);
router.get("/dashboard-graph-data", verifyToken, getDashboardGraphData);
router.post("/login", loginUser);

module.exports = router;
