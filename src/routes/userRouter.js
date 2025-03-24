const express = require('express');

const userRouter = express.Router();

userRouter.post('/signup');
userRouter.post('/login');

userRouter.post('/forgotPassword');
userRouter.post('/resetPassword');

module.exports = userRouter;
