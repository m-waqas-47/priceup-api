const Notification = require("@models/notifications");
const { fetchAllRecords } = require("@utils/DB_Pipelines/notifications");

class NotificationService {
  static findAll(condition) {
    return new Promise((resolve, reject) => {
      const pipeline = fetchAllRecords(condition);
      Notification.aggregate(pipeline)
        .then((result) => {
          resolve(result[0]);
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
