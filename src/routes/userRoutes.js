const express = require('express');
const {
  signUp,
  login,
  protectedRoute,
} = require('../controllers/authController');
const { getUser } = require('../controllers/userController');

const router = express.Router();

router.route('/signup').post(signUp);
router.route('/login').post(login);

router.route('/').get(protectedRoute, getUser);

module.exports = router;
