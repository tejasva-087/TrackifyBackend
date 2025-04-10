const express = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.route('/signup').post(authController.signUp);
router.route('/login').post(authController.login);
router.route('/forgotpassword').post(authController.forgotPassword);
router.route('/resetpassword/:token').patch(authController.resetPassword);

router.route('/').get(authController.protect, userController.getUser);

// TODO: UPDATE USER
// TODO: GET USER DETAILS (NAME, EMAIL)
// TODO: DEELTE USER
// TODO: FORGOT PASSWORD, RESET PASSWEORD

module.exports = router;
