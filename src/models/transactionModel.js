const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    default: 0,
    required: [true, 'Please specify the amount '],
  },
  shortDescription: {
    type: String,
    required: true,
    minLength: [
      50,
      'Please enter a consize description of not greater then 50 characters.',
    ],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
