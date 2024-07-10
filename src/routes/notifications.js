const {
  getMy,
  get,
  update,
  deleteById,
  deleteAll,
  deleteAllArchived,
  markAllAsRead,
  myUnreadCount,
} = require("@controllers/notification");
const express = require("express");
const { verifyToken } = require("@middlewares/authentication");
const router = express.Router();

router.get("/", verifyToken, getMy);
router.get("/my-unread", verifyToken, myUnreadCount);
router.get("/:id", verifyToken, get);
router.put("/mark-all-as-read", verifyToken, markAllAsRead);
router.put("/:id", verifyToken, update);
router.delete("/delete-all", verifyToken, deleteAll);
router.delete("/delete-all-archived", verifyToken, deleteAllArchived);
router.delete("/:id", verifyToken, deleteById);
module.exports = router;
