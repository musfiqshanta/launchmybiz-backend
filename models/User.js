const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Store only the hashed password
    hashedPassword: {
      type: String,
      required: true,
      select: false,
    },
    remember: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Instance method to compare a plain password with the stored hash
userSchema.methods.comparePassword = function comparePassword(plainPassword) {
  return bcrypt.compare(plainPassword, this.hashedPassword);
};

module.exports = mongoose.model('User', userSchema);


