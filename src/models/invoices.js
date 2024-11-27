const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    invoiceId: {
      type: String, // Unique Invoice ID (e.g., "INV-000001")
      required: "Invoice id is required",
    },
    type: {
      type: String,
      default: "project",
    },
    customer: {
      // Customer information
      type: mongoose.Schema.Types.Mixed,
    },
    items: [
      // List of items in the invoice
      {
        type: mongoose.Schema.Types.Mixed,
      },
    ],
    subTotal: Number, // Sum of all item totals
    tax: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    grandTotal: Number, // Final invoice amount after tax and discounts
    status: {
      type: String, // Invoice status (e.g., "Paid", "Unpaid", "Pending")
      default: "Unpaid",
    },
    issuedAt: {
      type: Date, // Date when the invoice was issued
      default: Date.now,
    },
    dueDate: {
      type: Date, // Payment due date
    },
    paymentDetails: {
      // Payment information (if applicable)
      method: String, // Payment method (e.g., "Credit Card", "Bank Transfer")
      transactionId: String, // Transaction ID (if paid)
      paidAt: Date, // Date when payment was received
    },
    customerPreview: {
      link: String,
      expiresAt: {
        type: Date,
        default: Date.now,
      },
    },
    notes: {
      type: String,
      default: "",
    },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Customer reference is required",
    },
    source_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Source reference is required",
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Company reference is required",
    },
  },
  { timestamps: true }
);
// Add the index to the company field
schema.index({ company_id: 1 });
module.exports = mongoose.model("invoices", schema);
