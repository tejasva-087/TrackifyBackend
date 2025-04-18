const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = async function (id) {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: '90d',
  });
};

exports.signUp = catchAsync(async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;
  const user = await User.create({ name, email, password, passwordConfirm });

  const token = await signToken(user._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: { email: user.email, name: user.name },
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    next(new AppError('Please provide email and password to login.'), 400);

  const user = await User.findOne({ email }).select('+password');
  const passwordMatch = await user.comparePassword(password, user.password);
  if (!user || !passwordMatch)
    return next(new AppError('Either the password or email are invalid', 401));

  const token = await signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
    user: {
      name: user.name,
      email: user.email,
    },
  });
});

exports.protectedRoute = catchAsync(async (req, res, next) => {
  const { authorization: token } = req.headers;

  if (!token && !token.startsWith('Bearer'))
    return next(
      new AppError('Please pass your jwt token to access this route.', 403),
    );
  const decodedToken = await jwt.verify(
    token.split(' ')[1],
    process.env.JWT_SECRET,
  );

  const user = await User.findById(decodedToken.id);
  if (!user)
    return next(
      new AppError('The user with that token no longer exists.', 403),
    );
  if (user.passwordChangedAfter(decodedToken.iat))
    return next(
      'The token has been expired please log back in to access this route.',
      403,
    );

  req.user = user;
  next();
});
