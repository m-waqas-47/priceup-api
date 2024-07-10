const Notification = require("@models/notifications");

class NotificationService {
  static findAll(data) {
    return new Promise((resolve, reject) => {
      Notification.find(data)
        .sort({ createdAt: "desc" })
        .then((notifications) => {
          resolve(notifications);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findBy(data) {
    return new Promise((resolve, reject) => {
      Notification.findOne(data)
        .then((notification) => {
          resolve(notification);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static update(condition, data) {
    return new Promise((resolve, reject) => {
      Notification.findOneAndUpdate(condition, data, { new: true })
        .then((notification) => {
          resolve(notification);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static delete(condition) {
    return new Promise((resolve, reject) => {
      Notification.findOneAndDelete(condition)
        .then((notification) => {
          resolve(notification);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static deleteAll(condition) {
    return new Promise((resolve, reject) => {
      Notification.deleteMany(condition)
        .then((notification) => {
          resolve(notification);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static count(condition) {
    return new Promise((resolve, reject) => {
      Notification.countDocuments(condition)
        .then((count) => {
          resolve(count);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static updateMany(condition, data) {
    return new Promise((resolve, reject) => {
        Notification.updateMany(condition, data)
        .then((resp) => {
          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static create(data) {
    return new Promise((resolve, reject) => {
      Notification.create(data)
        .then((notification) => {
          resolve(notification);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = NotificationService;
