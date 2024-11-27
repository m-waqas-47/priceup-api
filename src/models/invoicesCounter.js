const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    sequenceValue: {
      type: Number,
    },
  },
  { timestamps: true }
);
// Add the index to the company field
schema.index({ _id: 1 });
module.exports = mongoose.model("invoices_counter", schema);
