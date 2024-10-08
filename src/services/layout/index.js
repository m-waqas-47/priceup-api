const { fetchAllRecords } = require("@utils/DB_Pipelines/layouts");
const Layout = require("../../models/layouts");

class LayoutService {
  static findAll(data) {
    return new Promise((resolve, reject) => {
      Layout.find(data)
        .sort({ createdAt: "desc" })
        .then((layouts) => {
          resolve(layouts);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findAllWithDetail(condition) {
    return new Promise((resolve, reject) => {
      const pipeline = fetchAllRecords(condition);
      Layout.aggregate(pipeline)
        .then((result) => {
            resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findBy(data) {
    return new Promise((resolve, reject) => {
      Layout.findOne(data)
        .then((layout) => {
          resolve(layout);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static update(condition, data) {
    return new Promise((resolve, reject) => {
      Layout.findOneAndUpdate(condition, data, { new: true })
        .then((layout) => {
          resolve(layout);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static delete(condition) {
    return new Promise((resolve, reject) => {
      Layout.findOneAndDelete(condition)
        .then((layout) => {
          resolve(layout);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static deleteAll(condition) {
    return new Promise((resolve, reject) => {
      Layout.deleteMany(condition)
        .then((layout) => {
          resolve(layout);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static count(condition) {
    return new Promise((resolve, reject) => {
      Layout.countDocuments(condition)
        .then((count) => {
          resolve(count);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static create(data) {
    return new Promise((resolve, reject) => {
      Layout.create(data)
        .then((layout) => {
          resolve(layout);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = LayoutService;
