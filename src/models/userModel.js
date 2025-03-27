const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    required: [true, 'A user must have a name'],
    minLength: [3, 'The name must be at least 3 characters'],
    maxLength: [30, 'The name cannot be greater than 30 characters'],
    validate: {
      validator: function (name) {
        return validator.isAlpha(name.split(' ').join(''));
      },
      message: 'The name can only contain alphabets',
    },
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'A user must have an email'],
    validate: {
      validator: validator.isEmail,
      message: 'The email entered is not valid',
    },
  },
  password: {
    type: String,
    required: [true, 'A user must provide a password'],
    select: false,
    validate: {
      validator: validator.isStrongPassword,
      message:
        'A password must have at least 8 characters and should include at least one lowercase character, uppercase character, number, and a symbol',
    },
  },
  confirmPassword: {
    type: String,
    required: [true, 'A user must provide a confirm password'],
    validate: {
      validator: function (confirmPassword) {
        return this.password === confirmPassword;
      },
      message: 'The passwords do not match',
    },
  },
  changedPasswordAt: Date,
});

// if the password is modified then excripting it and storing it in the database before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
});

// encrypting the password and then conparing it with the password stored in the database

userSchema.methods.matchPassword = function (
  candidatePassword,
  originalPassword,
) {
  return bcrypt.compare(candidatePassword, originalPassword);
};

// checking if the user modified the password after a specific time
userSchema.methods.changedPasswordAfter = function (time) {
  if (!this.changedPasswordAt) return false;
  if (this.changedPasswordAt.getTime() / 1000 > time) {
    return true;
  }
  return false;
};

// Export the model correctly
const User = mongoose.model('User', userSchema);
module.exports = User;
