const mongoose = require("mongoose");

const blogUserSchema = new mongoose.Schema({
  userFirstName: {
    type: String,
  },
  userLastName: {
    type: String,
  },
  userEmail: {
    type: String,
    unique: true,
  },
  userPassword: {
    type: String,
  },
  userGender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  userContact: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const BlogUser = mongoose.model("BlogUser", blogUserSchema);

module.exports = BlogUser;
