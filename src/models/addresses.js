const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: "Name is required",
      minlength: [3, "Name must be atleast 3 character long"],
    },
    street: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    postalCode: {
      type: String,
    },
    country: {
      type: String,
      default: "America",
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
addressSchema.index({ name: 1, customer_id: 1 }, { unique: true });
addressSchema.index({ name: 1 });
addressSchema.index({ customer_id: 1 });

module.exports = mongoose.model("addresses", addressSchema);
