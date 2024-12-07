const Project = require("@models/projects");
const {
  fetchAllRecords,
  fetchSingleRecord,
  fetchGraphData,
  fetchStats,
} = require("@utils/DB_Pipelines/project");

class ProjectService {
  static findAll(condition, search = "", options = {}) {
    return new Promise((resolve, reject) => {
      const pipeline = fetchAllRecords(condition, search, options);
      Project.aggregate(pipeline)
        .then((result) => {
          if (
            options &&
            options.skip !== undefined &&
            options.limit !== undefined
          ) {
            const { totalRecords, projects } = result[0];
            resolve({ totalRecords, projects });
          } else {
            resolve(result);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findBy(condition) {
    return new Promise((resolve, reject) => {
      const pipeline = fetchSingleRecord(condition);
      Project.aggregate(pipeline)
        .then((result) => {
          resolve(result.length > 0 ? result[0] : null);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static stats(condition) {
    return new Promise((resolve, reject) => {
      const pipeline = fetchStats(condition);
      Project.aggregate(pipeline)
        .then((result) => resolve(result[0]))
        .catch((err) => reject(err));
    });
  }

  static graphData(condition) {
    return new Promise((resolve, reject) => {
      const pipeline = fetchGraphData(condition);
      Project.aggregate(pipeline)
        .then((result) => {
          resolve(result[0]);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static update(condition, data) {
    return new Promise((resolve, reject) => {
      Project.findOneAndUpdate(condition, data, { new: true })
        .then((record) => {
          resolve(record);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static updateMany(condition, data) {
    return new Promise((resolve, reject) => {
      Project.updateMany(condition, data)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static delete(condition) {
    return new Promise((resolve, reject) => {
      Project.findOneAndDelete(condition)
        .then((record) => {
          resolve(record);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static deleteAll(condition) {
    return new Promise((resolve, reject) => {
      Project.deleteMany(condition)
        .then((record) => {
          resolve(record);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static count(condition) {
    return new Promise((resolve, reject) => {
      Project.countDocuments(condition)
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
      Project.create(data)
        .then((record) => {
          resolve(record);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = ProjectService;
