const mongoose = require('mongoose');

const autoPaySchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    default: 0,
    required: [true, 'Please specify the amount'],
  },
  shortDescription: {
    type: String,
    required: true,
    maxLength: [
      50,
      'Please enter a concise description of not more than 50 characters.',
    ],
  },
  frequency: {
    type: Number, // Number of days after which payment is made
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

autoPaySchema.virtual('nextPaymentDate').get(function () {
  if (!this.createdAt || !this.frequency) return null;

  const nextPayment = new Date(this.createdAt);
  nextPayment.setDate(nextPayment.getDate() + this.frequency);

  return nextPayment;
});

const AutoPay = mongoose.model('AutoPay', autoPaySchema);

module.exports = AutoPay;
