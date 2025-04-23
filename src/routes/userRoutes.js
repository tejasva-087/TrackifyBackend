const express = require('express');
const {
  signUp,
  login,
  protectedRoute,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/authController');
const { getUser } = require('../controllers/userController');

const router = express.Router();

router.route('/signup').post(signUp);
router.route('/login').post(login);

router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:token').patch(resetPassword);
router.route('/updatepassword').patch(protectedRoute, updatePassword);

router.route('/').get(protectedRoute, getUser);

module.exports = router;
