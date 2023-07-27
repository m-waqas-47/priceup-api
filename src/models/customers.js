const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: "Name is required",
      minlength: [3, "Name must be atleast 3 character long"],
    },
    email: {
      type: String,
      required: "Email is required",
      match: /.+\@.+\..+/,
      unique: true,
    },
    image: {
      type: String,
      default: "images/staff/default.jpg",
    },
    address: {
      type: String,
      default: "",
    },
    lastQuotedOn: {
      type: String,
      default: "",
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Company reference is required",
    },
  },
  { timestamps: true }
);

// Create a compound index for email and company_id
customerSchema.index({ email: 1, company_id: 1 }, { unique: true });

module.exports = mongoose.model("customers", customerSchema);
