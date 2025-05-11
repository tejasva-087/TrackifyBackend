const Transaction = require('../models/transactionModel');
const catchAsync = require('../utils/catchAsync');

exports.addTransaction = catchAsync(async (req, res) => {
  const transaction = await Transaction.create({
    ...req.body,
    user: req.user.id,
  });

  res.status(200).json({
    status: 'success',
    data: {
      transaction,
    },
  });
});
