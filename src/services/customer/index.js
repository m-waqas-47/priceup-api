const Customer = require("../../models/customers");

class CustomerService {
  static findAll(data) {
    return new Promise((resolve, reject) => {
      Customer.find(data)
        .then((customers) => {
          resolve(customers);
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
