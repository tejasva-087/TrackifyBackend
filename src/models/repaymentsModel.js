const mongoose = require('mongoose');

const repaymentSchema = mongoose.Schema({
  lender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  payer: {
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

const Repayment = mongoose.model('Repayment', repaymentSchema);

module.exports = Repayment;
