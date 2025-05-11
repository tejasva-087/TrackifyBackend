const mongoose = require('mongoose');

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

exports.deleteTransaction = catchAsync(async (req, res, next) => {
  await Transaction.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getAllTransaction = catchAsync(async (req, res) => {
  const transactions = await Transaction.find({ _id: req.user.id });

  res.status(200).json({
    status: 'success',
    data: {
      transactions,
    },
  });
});

exports.updateTransaction = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    status: 'success',
    data: {
      transaction,
    },
  });
});

exports.totalSpent = catchAsync(async (req, res) => {
  const totalSpend = await Transaction.aggregate({
    $match: {
      user: req.user.id,
    },
    $group: {
      _id: null,
      totalSpent: { $sum: '$amount' },
    },
  });

  res.status(200).json({
    status: 'success',
    data: {
      totalSpend,
    },
  });
});
