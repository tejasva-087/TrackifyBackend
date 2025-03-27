const mongoose = require('mongoose');

const loanSchema = mongoose.Schema({
  borrower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    default: 0,
    required: [true, 'Please specify the amount '],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Loan = mongoose.model('Loan', loanSchema);

module.exports = Loan;
