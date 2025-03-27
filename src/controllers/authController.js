const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAcync = require('../utils/catchAcync');

exports.signUp = catchAcync(async (req, res, next) => {
  // 1) creating new user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    changedPasswordAt: req.body.changedPasswordAt,
  });

  // creating a jwt token
  const token = await jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '90d',
    },
  );

  // sending back the users data and the token
  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    },
  });
});

exports.login = catchAcync(async (req, res, next) => {
  // 1) checking if the provided credentials exist or not
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError('Please provide email and password', 400));

  // 2) checking if the user with that email actually exist of not and if the password matches the user's password stored in the database
  const user = await User.findOne({ email }).select('+password');

  if (!user || !user.matchPassword(password, user.password))
    return new AppError('The email or password is invalid', 400);

  // 3) sign a jwt token
  const token = await jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '90d',
    },
  );

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    },
  });
});

exports.protect = catchAcync(async (req, res, next) => {
  // 1) checking if the JWT TOKEN parameter is valid
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token)
    return next(
      new AppError('You are not logged in please login to get access', 404),
    );

  // 2) Validating the token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  // 3) checking if the user exist or not
  const user = await User.findById(decoded.id).select('-changedPasswordAt');

  if (!user)
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401,
      ),
    );
  // 4) Checking if the user has changed the password and is using the old token
  if (user.changedPasswordAfter(decoded.iat))
    next(
      new AppError(
        'The token is not valid the user changed their password recently please log in again',
        401,
      ),
    );

  // When every thing is fine this means the user that wants to access the route is valid and can continue with the request.
  req.user = user;
  next();
});

exports.resetPassword = catchAcync(async (req, res, next) => {});

exports.forgotPassword = catchAcync(async (req, res, next) => {});
