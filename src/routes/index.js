const express = require("express");
const { loginUser } = require("../controllers/authentication");
const { verifyToken } = require("@middlewares/authentication");
const { getDashboardGraphData, getDashboardStats } = require("@controllers/dashboard");
const rateLimitMiddleware = require("@middlewares/requestRateLimit");
const { getCustomerRequest, getLocations, getLocationData, updateCustomerRequest, formSubmittedWebhook } = require("@controllers/formRequest");
const { requiredProps } = require("@config/common");
const { validateRequiredProps } = require("@middlewares/validator");
const router = express.Router();
const { getCustomerInvoicePreview } = require("@controllers/customerInvoicePreview");
const { runCustomScripts } = require("@controllers/customScripts");

router.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send("Backend Server Running");
});
router.get("/locations", getLocations);
router.get("/location-data/:id", getLocationData);
router.get("/dashboard-stats", verifyToken, getDashboardStats);
router.get("/dashboard-graph-data", verifyToken, getDashboardGraphData);
router.get("/invoice-preview/:id",getCustomerInvoicePreview);
router.put("/run-custom-scripts",runCustomScripts);
router.post("/form-submitted-webhook", formSubmittedWebhook);
router.post("/form-request", rateLimitMiddleware(5 * 60 * 1000, 50), validateRequiredProps(requiredProps.FORMREQUEST), getCustomerRequest);
router.post("/form-request-update",updateCustomerRequest);
router.post("/login", loginUser);
router.post("/form-submitted-webhook",(req,res) => {
  const data = {...req.body};
  try{
    console.log(data,'data');
    return res.status(200).json(data);
  }
  catch(err){
   return res.status(400).json({
      code: statusCode,
      message: err.message,
    });
  }
});

module.exports = router;
