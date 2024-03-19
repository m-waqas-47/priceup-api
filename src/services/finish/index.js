const Finish = require("../../models/finishes");

class FinishService {
  static findAll(data) {
    return new Promise((resolve, reject) => {
      Finish.find(data)
        .sort({ createdAt: "desc" })
        .then((finishes) => {
          resolve(finishes);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findBy(data) {
    return new Promise((resolve, reject) => {
      Finish.findOne(data)
        .then((finish) => {
          resolve(finish);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static update(condition, data) {
    return new Promise((resolve, reject) => {
      Finish.findOneAndUpdate(condition, data, { new: true })
        .then((finish) => {
          resolve(finish);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static delete(condition) {
    return new Promise((resolve, reject) => {
      Finish.findOneAndDelete(condition)
        .then((finish) => {
          resolve(finish);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static deleteAll(condition) {
    return new Promise((resolve, reject) => {
      Finish.deleteMany(condition)
        .then((finish) => {
          resolve(finish);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static count(condition) {
    return new Promise((resolve, reject) => {
      Finish.countDocuments(condition)
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
      Finish.create(data)
        .then((finish) => {
          resolve(finish);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = FinishService;
