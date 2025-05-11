const express = require('express');
const { protectedRoute } = require('../controllers/authController');
const { addTransaction } = require('../controllers/transactionController');

const router = express.Router();

router.route('/').post(protectedRoute, addTransaction);

module.exports = router;
