const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema('User', {
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    minLength: [3, 'The name must be atleast 3 characters'],
    maxLength: [30, 'The name can not be greater then 30 characters'],
    // TODO: Add in validator to check if the name is valid or not
  },
  email: {
    type: String,
    required: [true, 'A user must have email'],
    validator: [validator.isEmail, 'The email entered is not valid'],
  },
});

const User = mongoose.model(userSchema);

module.export = User;
