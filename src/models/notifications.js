const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: "Category is required",
      minlength: [3, "Category must be at least 3 characters long"],
    },
    description: {
      type: String,
      required: "Description is required",
      minlength: [3, "Description must be at least 3 characters long"],
    },
    performer_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Performer reference is required",
    },
    performer_role: {
      type: String,
      required: "Performer role is required",
    },
    action: {
      type: String,
      required: "Action is required",
    },
    resource_id: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    viewer: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Viewer reference is required",
    },
    isRead: {
      type: Boolean,
      default: true,
    },
    archived: {
      type: Boolean,
      default: false,
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Company reference is required",
    },
  },
  { timestamps: true }
);
// Add the index to the company and viewer field
notificationSchema.index({ company_id: 1 });
notificationSchema.index({ viewer: 1 });
module.exports = mongoose.model("notifications", notificationSchema);
