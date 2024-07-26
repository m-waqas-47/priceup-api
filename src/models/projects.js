const { projectStatus } = require("@config/common");
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: "Name is required",
      minlength: [3, "Name must be atleast 3 character long"],
    },
    notes: {
      type: String,
    },
    totalAmountQuoted: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
      required: "Project location is required",
    },
    address: {
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
        default:"America"
      },
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
    status: {
      type: String,
      default: projectStatus.PENDING,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("projects", projectSchema);
