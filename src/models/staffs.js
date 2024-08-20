const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { userRoles } = require("../config/common");

const staffSchema = new mongoose.Schema(
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
      default: "images/staffs/default.jpg",
    },
    password: {
      type: String,
      default: "abcdef",
      // required: "Password is required",
      // minlength: [8, "Password must be atleast 8 character long"],
    },
    lastQuoted: {
      type: String,
      default: "",
    },
    totalQuoted: {
      type: Number,
      default: 0.0,
    },
    role: {
      type: String,
      default: userRoles.STAFF,
    },
    status: {
      type: Boolean,
      default: true,
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Company reference is required",
    },
    haveAccessTo:[{
      type:mongoose.Schema.Types.ObjectId,
      default: null
    }],
  },
  { timestamps: true }
);

staffSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

staffSchema.pre("findOneAndUpdate", async function (next) {
  if (this._update.password) {
    // Check if the password is being modified
    this._update.password = await bcrypt.hash(this._update.password, 10);
  }
  next();
});

staffSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

staffSchema.methods.generateJwt = function (companyId) {
  return jwt.sign(
    {
      id: this._id,
      name: this.name,
      email: this.email,
      image: this.image,
      company_id: companyId,
      role: userRoles.STAFF,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};
// Add the index to the company field
staffSchema.index({ company_id: 1 });
module.exports = mongoose.model("staffs", staffSchema);
