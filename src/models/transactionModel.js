const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [
      true,
      'Please provide the id of the user who is creating the transaction.',
    ],
  },
  amount: {
    type: String,
    required: [true, 'To create a transaction an amount must be specified.'],
    validate: [
      {
        validator: (amount) => +amount > 0,
        message: 'The amount can not be less then 0',
      },
    ],
  },
  type: {
    type: String,
    enum: ['credited', 'debited'],
    default: 'debited',
  },
  description: {
    type: String,
    required: [true, 'Please enter the reason for transaction.'],
    max: [200, 'The description can not be more then 200 characters.'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
