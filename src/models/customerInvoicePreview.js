const mongoose = require("mongoose");

const customerInvoicePreview = new mongoose.Schema({
  name: {
    type: String,
    default: "",
  },
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: "Project reference is required",
  },
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: "Company reference is required",
  },
  customer_id:{
    type: mongoose.Schema.Types.ObjectId,
    required: "Customer reference is required",
  },
  content:{
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 1296000, // 1296000 seconds = 15 days (15 * 24 * 60 * 60)
  },
});

module.exports = mongoose.model("customer_invoice_preview", customerInvoicePreview);
