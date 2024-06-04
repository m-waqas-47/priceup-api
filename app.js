const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("module-alias/register");
require("@db/connection");

const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const port = process.env.PORT || 5000;
const hardwareCategoryRouter = require("@routes/hardwareCategory");
const userRouter = require("@routes/users");
const companyRouter = require("@routes/companies");
const finishRouter = require("@routes/finishes");
const hardwareRouter = require("@routes/hardwares");
const layoutRouter = require("@routes/layouts");
const glassTypeRouter = require("@routes/glassTypes");
const glassAddonRouter = require("@routes/glassAddons");
const staffRouter = require("@routes/staffs");
const customerRouter = require("@routes/customers");
const estimateRouter = require("@routes/estimates");
const adminRouter = require("@routes/admins");
const indexRouter = require("@routes/index");
const customUsers = require("@routes/customUsers");
const mirrorsRouter = require("@routes/mirror");

app.use(
  cors({
    origin: "*",
    // methods: "GET,POST,PUT,DELETE",
    // credentials:true,
    // optionSuccessStatus:200,
  })
);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/hardwareCategory", hardwareCategoryRouter);
app.use("/users", userRouter);
app.use("/staffs", staffRouter);
app.use("/admins", adminRouter);
app.use("/customers", customerRouter);
app.use("/companies", companyRouter);
app.use("/finishes", finishRouter);
app.use("/hardwares", hardwareRouter);
app.use("/layouts", layoutRouter);
app.use("/estimates", estimateRouter);
app.use("/glassTypes", glassTypeRouter);
app.use("/glassAddons", glassAddonRouter);
app.use("/customUsers", customUsers);
app.use("/mirrors", mirrorsRouter);
app.use("/", indexRouter);

app.listen(port, () => {
  console.log(`App is listening on PORT ${port}`);
});
