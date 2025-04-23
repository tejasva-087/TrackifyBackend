const crypto = require('crypto');

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
    validate: [validator.isEmail, 'Please enter a valid email.'],
  },
  password: {
    select: false,
    type: String,
    required: [true, 'Please provide the password.'],
    minLength: [8, 'Password mush have at least 8 characters.'],
    validate: [
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
  passwordModifiedAt: Date,
  passwordResetToken: String,
  passwordResetTokenCreatedAt: Date,
});

// ******************************
// MIDDLEWARES
// ******************************

// NOTE: Encrypting the password if changed or newly created before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// NOTE: IF THE PASSWORD IS MODIFIED THEN CHANGING THE MODIFIED AT TIMING
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordModifiedAt = Date.now();
  next();
});

// ******************************
// INSTANCE METHODS
// ******************************

// NOTE: comparing the un-hashed password with the hashed password
userSchema.methods.checkPassword = async function (
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

//  NOTE: creating a simple token for the letting the user resetting the password
userSchema.methods.createPasswordResetToken = async function () {
  const token = await crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = await crypto.hash('sha256', token, 'hex');
  this.passwordResetTokenCreatedAt = Date.now();
  await this.save();
  return token;
};

// NOTE: checking if the user is resetting the password within 10min
userSchema.methods.passwordChangesAfter = function () {
  return (
    Date.now() >
    new Date(this.passwordResetTokenCreatedAt).getTime() + 10 * 60 * 1000
  );
};

const User = mongoose.model('User', userSchema);

module.exports = User;
