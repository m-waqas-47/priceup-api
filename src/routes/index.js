const express = require("express");
const { loginUser } = require("../controllers/authentication");
const { verifyToken } = require("@middlewares/authentication");
const { getDashboardGraphData, getDashboardStats } = require("@controllers/dashboard");
const rateLimitMiddleware = require("@middlewares/requestRateLimit");
const { getCustomerRequest, getLocations, getLocationData } = require("@controllers/formRequest");
const { requiredProps } = require("@config/common");
const { validateRequiredProps } = require("@middlewares/validator");
// const { handleError, handleResponse } = require("@utils/responses");
const router = express.Router();
// const axios = require("axios"); // Ensure axios is imported if not already
const { getCustomerInvoicePreview } = require("@controllers/customerInvoicePreview");

router.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send("Backend Server Running");
});
router.get("/locations", getLocations);
router.get("/location-data/:id", getLocationData);
router.get("/dashboard-stats", verifyToken, getDashboardStats);
router.get("/dashboard-graph-data", verifyToken, getDashboardGraphData);
router.get("/invoice-preview/:id",getCustomerInvoicePreview);
router.post("/form-request", rateLimitMiddleware(5 * 60 * 1000, 50), validateRequiredProps(requiredProps.FORMREQUEST), getCustomerRequest);
router.post("/login", loginUser);
// router.post("/create-test-customer", async (req,res) => {
//   const url = `https://services.leadconnectorhq.com/opportunities/pipelines?locationId=wMf03l211vQKvcwKgDYJ`;
//   const headers = {
//     Authorization: `Bearer pit-e3e78855-c6a4-4218-9688-df804af80e8c`,
//     Version: "2021-07-28",
//     "Content-Type": "application/json",
//   };
//   const data = {
//     firstName: "34231",
//     lastName: "45343rwrw2",
//     name: "3fs23r32fwe2",
//     email: "someone@something1.com",
//     locationId: "wMf03l211vQKvcwKgDYJ",
//     gender: "male",
//     phone: "2332423432423433",
//     address1: "324324324343432dfdsfsdf",
//     city: "Dolomite",
//     state: "AL",
//     postalCode: "35061",
//     timezone: "America/Chihuahua",
//     source: "public api",
//     tags: ["contact created from api"],
//     country: "US",
//   };
//   try{
//    const resp =  await axios.get(url, { headers });
//    handleResponse(res,200,"sdss",resp.data.pipelines);
//   }
//   catch(err){
//     handleError(res,err);
//   }
// })

module.exports = router;
