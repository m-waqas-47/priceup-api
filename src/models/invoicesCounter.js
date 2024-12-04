const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    _id: {
      type: String, // Explicitly set _id to String for "invoiceId"
    },
    sequenceValue: {
      type: Number,
      default: 0, // Initialize to 0 for the first invoice
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("invoices_counter", schema);
