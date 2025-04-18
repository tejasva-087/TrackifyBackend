const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name.'],
    validate: {
      validator: (name) => {
        validator.isAlpha(name.split(' ').join(''));
      },
      message: 'Name can only have letters.',
    },
    minLength: [3, 'Name must be at least 3 characters.'],
    maxLength: [30, 'Name must not be greater then 30 characters.'],
  },
  email: {
    type: String,
    required: [true, 'Please provide email.'],
    unique: [true, 'Another account with similar email already exists.'],
    validator: [validator.isEmail, 'Please enter a valid email.'],
  },
  password: {
    select: false,
    type: String,
    required: [true, 'Please provide the password.'],
    minLength: [8, 'Password mush have at least 8 characters.'],
    validator: [
      validator.isStrongPassword,
      'Password mush have a symbols, uppercase and lowercase characters and numbers.',
    ],
  },
  passwordConfirm: {
    select: false,
    type: String,
    required: [true, 'Please provide a confirmation password.'],
    validate: {
      validator: function (password) {
        return this.password === password;
      },
      message: 'The passwords do not match.',
    },
  },
  passwordModifiedAt: String,
});

// NOTE: Encrypting the password if changed or newly created before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// NOTE: comparing the un-hashed password with the hashed password
userSchema.methods.comparePassword = async function (
  candidatePassword,
  password,
) {
  return await bcrypt.compare(candidatePassword, password);
};

// NOTE: checking if the password is modified after the token has been issued
userSchema.methods.passwordChangedAfter = function (time) {
  if (!this.passwordModifiedAt) return false;
  return this.passwordModifiedAt > time;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
