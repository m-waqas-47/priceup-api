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
  content:{
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 900, // 900 seconds = 15 minutes
  },
});

module.exports = mongoose.model("customer_invoice_preview", customerInvoicePreview);
