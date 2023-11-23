const Layout = require("../../models/layouts");

class LayoutService {
  static findAll(data) {
    return new Promise((resolve, reject) => {
      Layout.find(data).sort({createdAt: "asc"})
        .then((layouts) => {
          resolve(layouts);
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
