const express = require('express');
const { protectedRoute } = require('../controllers/authController');
const {
  addTransaction,
  deleteTransaction,
  getAllTransaction,
  updateTransaction,
  totalSpent,
} = require('../controllers/transactionController');

const router = express.Router();

router
  .route('/')
  .post(protectedRoute, addTransaction)
  .get(protectedRoute, getAllTransaction);

router
  .route('/:id')
  .delete(protectedRoute, deleteTransaction)
  .patch(protectedRoute, updateTransaction);

router.get('/totalSpent', protectedRoute, totalSpent);

module.exports = router;
