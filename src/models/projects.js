const { projectStatus } = require("@config/common");
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: "Name is required",
      minlength: [3, "Name must be atleast 3 character long"],
      // unique: true,
    },
    notes: {
      type: String,
    },
    totalAmountQuoted: {
      type: Number,
      default: 0,
    },
    address_id: {
      type: mongoose.Schema.Types.ObjectId,
      // required: "Address reference is required",
      default: null
    },
    contact_id: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    creator_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Creator reference is required",
    },
    creator_type: {
      type: String,
      required: "Creator role is required",
    },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Customer reference is required",
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Company reference is required",
    },
    opportunity_id: {
      type: String,
      default: null
    },
    created_source:{
      type: String,
      default: "Application"
    },
    status: {
      type: String,
      default: projectStatus.PENDING,
    },
  },
  { timestamps: true }
);
projectSchema.index({ company_id: 1 });
projectSchema.index({ name: 1 });
module.exports = mongoose.model("projects", projectSchema);
