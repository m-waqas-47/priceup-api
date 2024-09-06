const { notificationCategories } = require("@config/common");
// const CompanyService = require("@services/company");
const NotificationService = require("@services/notification");
const { getResourceInfo } = require("@utils/notification");
const { handleError, handleResponse } = require("@utils/responses");
const { default: mongoose } = require("mongoose");

exports.getMy = async (req, res) => {
  const user_id = req.user.id;
  const company_id = req.user?.company_id;
  try {
    console.log(user_id,'id');
    const query = { viewer: new mongoose.Types.ObjectId(user_id) };
    if (company_id) {
      query.company_id = new mongoose.Types.ObjectId(company_id);
    }
    const data = await NotificationService.findAll(query);
    // const companies = await CompanyService.findAll();
    // const notifications = await NotificationService.findAll({
    //   viewer: user_id,
    // });
    // const result = await Promise.all(
    //   notifications.map(async (notification) => {
    //     const companyData = companies.find(
    //       (item) => item.id === notification?.company_id?.toString()
    //     );
    //     const notificationObject = notification.toObject();
    //     return {
    //       ...notificationObject,
    //       company_name:companyData?.name
    //     }
    //   }));
    // const unReadCount = await NotificationService.count({
    //   viewer: user_id,
    //   isRead: false,
    // });
    handleResponse(res, 200, `All Notifications`, data);
  } catch (err) {
    handleError(res, err);
  }
};

exports.get = async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await NotificationService.findBy({ _id: id });
    if (!notification) {
      throw new Error("Invalid notification Id");
    }
    const resourceInfo = await getResourceInfo({
      category: notification.category,
      id: notification.resource_id,
    });
    const notificationObject = notification.toObject();
    const data = { ...notificationObject, resourceInfo };
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
