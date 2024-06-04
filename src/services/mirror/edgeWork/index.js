const MirrorEdgeWorks = require("@models/mirror/edgeWorks");

class MirrorEdgeWorkService {
  static findAll(data) {
    return new Promise((resolve, reject) => {
      MirrorEdgeWorks.find(data)
        .sort({ createdAt: "desc" })
        .then((edgeWorks) => {
          resolve(edgeWorks);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findBy(data) {
    return new Promise((resolve, reject) => {
      MirrorEdgeWorks.findOne(data)
        .then((edgeWork) => {
          resolve(edgeWork);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static update(condition, data) {
    return new Promise((resolve, reject) => {
      MirrorEdgeWorks.findOneAndUpdate(condition, data, { new: true })
        .then((edgeWork) => {
          resolve(edgeWork);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static delete(condition) {
    return new Promise((resolve, reject) => {
      MirrorEdgeWorks.findOneAndDelete(condition)
        .then((edgeWork) => {
          resolve(edgeWork);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static deleteAll(condition) {
    return new Promise((resolve, reject) => {
      MirrorEdgeWorks.deleteMany(condition)
        .then((edgeWork) => {
          resolve(edgeWork);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static count(condition) {
    return new Promise((resolve, reject) => {
      MirrorEdgeWorks.countDocuments(condition)
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
      MirrorEdgeWorks.create(data)
        .then((edgeWork) => {
          resolve(edgeWork);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = MirrorEdgeWorkService;
