const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { userRoles } = require("../config/common");

const adminSchema = new mongoose.Schema(
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
      default: "images/users/default.jpg",
    },
    password: {
      type: String,
      default: "abcdef",
      // required: "Password is required",
      // minlength: [8, "Password must be atleast 8 character long"],
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

adminSchema.pre("findOneAndUpdate", async function (next) {
  if (this._update.password) {
    // Check if the password is being modified
    this._update.password = await bcrypt.hash(this._update.password, 10);
  }
  next();
});

adminSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

adminSchema.methods.generateJwt = function (companyId) {
  return jwt.sign(
    {
      id: this._id,
      name: this.name,
      email: this.email,
      image:this.image,
      company_id: companyId,
      role: userRoles.SUPER_ADMIN,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};

module.exports = mongoose.model("admins", adminSchema);
