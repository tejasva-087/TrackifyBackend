const mongoose = require('mongoose');
const validator = require('validator');

const participantSchema = new mongoose.Schema({
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
  relatedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Participant = mongoose.model('Participant', participantSchema);

module.exports = Participant;
