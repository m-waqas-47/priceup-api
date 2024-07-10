const express = require("express");
const cors = require("cors");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
require("dotenv").config();
require("module-alias/register");
require("@db/connection");

const app = express();
const server = createServer(app);
const socketIo = new Server(server);
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
const notificationsRouter = require("@routes/notifications");
const { socketIoChannel } = require("@config/common");

app.use(cors({ origin: "*" }));
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
app.use("/notifications", notificationsRouter);
app.use("/", indexRouter);

// Socket.IO connection
socketIo.on("connection", (socket) => {
  console.log("A client connected");
  socket.on(socketIoChannel.NOTIFICATIONS, (msg) => {
    console.log("message: " + msg);
    socket.broadcast.emit(socketIoChannel.NOTIFICATIONS, msg);
  });
  socket.on("disconnect", () => {
    console.log("client disconnected");
  });
});

server.listen(port, () => {
  console.log(`App is listening on PORT ${port}`);
});
