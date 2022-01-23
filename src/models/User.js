const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Please provide username"],
    minLength: [3, "username must be at least 3 characters long"],
    maxLength: [12, "username must be less than 12 characters long"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    trim: true,
    required: [true, "Please provide email"],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minLength: [5, "password must be at least 5 characters long"],
    select: false,
  },
});

//create jwt token
userSchema.methods.createJWT = function () {
  return jwt.sign({ email: this.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};
//compare login password with crypted password
userSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);

  return isMatch;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
