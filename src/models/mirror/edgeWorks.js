const mongoose = require("mongoose");

const edgeWorkSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: "Name is required",
      minlength: [3, "Name must be atleast 3 character long"],
    },
    slug: {
      type: String,
      required: "Slug is required",
      minlength: [3, "Slug must be atleast 3 character long"],
    },
    image: {
      type: String,
      default: "images/others/default.png",
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Company reference is required",
    },
    options: [
      {
        cost: {
          type: Number,
          default: 0.0,
        },
        thickness: {
          type: String,
          required: "Thickness value is required",
        },
        status: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);
// Add the index to the company field
edgeWorkSchema.index({ company_id: 1 });
module.exports = mongoose.model("mirror_edge_works", edgeWorkSchema);
