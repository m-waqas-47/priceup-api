const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: "Name is required",
      minlength: [3, "Name must be atleast 3 character long"],
    },
    phone: {
      type: String,
      required: "Phone number is required",
    //   default: "",
    },
    address: {
      type: String,
      default: "",
    },
    lastQuotedOn: {
      type: Date,
      default: null,
    },
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: "Customer reference is required",
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Company reference is required",
    },
  },
  { timestamps: true }
);
// Add the index to the company field
contactSchema.index({ company_id: 1 });
// Create a compound index for email and company_id
contactSchema.index({ phone: 1, customer_id: 1}, { unique: true });

module.exports = mongoose.model("contacts", contactSchema);
