const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    sequenceValue: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("invoices_counter", schema);
