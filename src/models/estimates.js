const mongoose = require("mongoose");

const estimateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: "Estimate category is required",
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Company reference is required",
    },
    creator_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Creator reference is required",
    },
    creator_type: {
      type: String,
      required: "Creator role is required",
    },
    // customer_id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: "Customer reference is required",
    // },
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      // default: null,
      required: "Project reference is required",
    },
    status: {
      type: String,
      default: "pending",
    },
    cost: {
      type: Number,
      default: 0,
    },
    config: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);
// Add the index to the company field
estimateSchema.index({ company_id: 1 });
module.exports = mongoose.model("estimates", estimateSchema);
