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
      default: "",
      // required: "Email is required",
      // match: /.+\@.+\..+/,
    },
    phone: {
      type: String,
      // required: "Phone number is required",
      default: "",
    },
    image: {
      type: String,
      default: "images/others/default.png",
    },
    address: {
      type: String,
      default: "",
    },
    lastQuotedOn: {
      type: String,
      default: "",
    },
    highlevel_contact_id:{
      type: String,
      default: null
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Company reference is required",
    },
  },
  { timestamps: true }
);
// Add the index to the company field
customerSchema.index({ company_id: 1 });
// Create a compound index for email and company_id
// customerSchema.index({ email: 1, company_id: 1}, { unique: true });

module.exports = mongoose.model("customers", customerSchema);
