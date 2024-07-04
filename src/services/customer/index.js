const Customer = require("../../models/customers");

class CustomerService {
  static findAll(query,options) {
    return new Promise((resolve, reject) => {
      Customer.find(query)
        .skip(options?.skip ?? 0)
        .limit(options?.limit ?? 0)
        .sort({ createdAt: "desc" })
        .then((customers) => {
          resolve(customers);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static delete(condition) {
    return new Promise((resolve, reject) => {
      Customer.findOneAndDelete(condition)
        .then((customers) => {
          resolve(customers);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static deleteAll(condition) {
    return new Promise((resolve, reject) => {
      Customer.deleteMany(condition)
        .then((customer) => {
          resolve(customer);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findBy(data) {
    return new Promise((resolve, reject) => {
      Customer.findOne(data)
        .then((customer) => {
          resolve(customer);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static update(condition, data, options) {
    return new Promise((resolve, reject) => {
      Customer.findOneAndUpdate(condition, data, options)
        .then((customer) => {
          resolve(customer);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static count(condition) {
    return new Promise((resolve, reject) => {
      Customer.countDocuments(condition)
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
      Customer.create(data)
        .then((customer) => {
          resolve(customer);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = CustomerService;
