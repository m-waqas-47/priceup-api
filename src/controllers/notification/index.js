const NotificationService = require("@services/notification");
const { handleError, handleResponse } = require("@utils/responses");

exports.getMy = async (req, res) => {
  const user_id = req.user.id;
  NotificationService.findAll({ viewer: user_id })
    .then((records) => {
      handleResponse(res, 200, `All Notifications`, records);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.get = async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await NotificationService.findBy({ _id: id });
    const data = { ...notification };
    if (!notification) {
      throw new Error("Invalid notification Id");
    }

    handleResponse(res, 200, "Record", data);
  } catch (err) {
    handleError(res, err);
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  try {
    const notification = await NotificationService.update({ _id: id }, data);
    handleResponse(res, 200, "Record updated", notification);
  } catch (err) {
    handleError(res, err);
  }
};

exports.deleteById = async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await NotificationService.delete({ _id: id });
    handleResponse(res, 200, "Record updated", notification);
  } catch (err) {
    handleError(res, err);
  }
};

exports.deleteAll = async (req, res) => {
  const userId = req.user.id;
  try {
    const notification = await NotificationService.deleteAll({
      viewer: userId,
      archived: false,
    });
    handleResponse(res, 200, "Record updated", notification);
  } catch (err) {
    handleError(res, err);
  }
};

exports.deleteAllArchived = async (req, res) => {
  const userId = req.user.id;
  try {
    const notification = await NotificationService.deleteAll({
      viewer: userId,
      archived: true,
    });
    handleResponse(res, 200, "Record updated", notification);
  } catch (err) {
    handleError(res, err);
  }
};

exports.markAllAsRead = async (req, res) => {
  const userId = req.user.id;
  try {
    const notification = await NotificationService.updateMany(
      {
        viewer: userId,
      },
      { isRead: true }
    );
    handleResponse(res, 200, "Records updated", notification);
  } catch (err) {
    handleError(res, err);
  }
};

exports.myUnreadCount = async (req, res) => {
  const userId = req.user.id;
  NotificationService.count({ viewer: userId, isRead: false })
    .then((counts) => {
      handleResponse(res, 200, `Unread messages`, counts);
    })
    .catch((err) => {
      handleError(res, err);
    });
};
