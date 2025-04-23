const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendMail = require('../utils/email');

const signToken = async function (id) {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
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
  const passwordMatch = await user.checkPassword(password, user.password);
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
      new AppError('Please pass your jwt token to access this route.', 401),
    );

  const decodedToken = await jwt.verify(
    token.split(' ')[1],
    process.env.JWT_SECRET,
  );

  const user = await User.findById(decodedToken.id);
  if (!user)
    return next(
      new AppError('The user with that token no longer exists.', 401),
    );
  if (user.passwordChangedAfter(decodedToken.iat))
    return next(
      new AppError(
        'The token has been expired please log back in to access this route.',
        403,
      ),
    );

  req.user = user;
  next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return next(new AppError('The user with this email does not exists.', 404));

  const resetPasswordToken = await user.createPasswordResetToken();
  const resetPasswordLink = `${req.protocol}://${req.get('host')}/user/resetpassword/${resetPasswordToken}`;
  const message = `Please click on the link to reset your password: ${resetPasswordLink}`;

  try {
    await sendMail({
      to: 'khandelwaltejasva@gmail.com',
      subject: 'PASSWORD RESET LINK',
      text: message,
    });
  } catch (err) {
    return next('There was  problem sending the password reset link.', 400);
  }

  res.status(200).json({
    status: 'success',
    message:
      'A password reset link has been sent to your mail. Please use it to reset your password.',
    resetPasswordToken,
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token: resetToken } = req.params;
  const { password, passwordConfirm } = req.body;

  if (!resetToken) return next(new AppError('No token found.', 400));
  if (!password || !passwordConfirm)
    return next(
      new AppError(
        'Please provide password to change nad password confirm to change the password',
        400,
      ),
    );

  const encryptedToken = await crypto.hash('sha256', resetToken, 'hex');
  const user = await User.findOne({
    passwordResetToken: encryptedToken,
  });

  if (!user || user.passwordChangesAfter())
    return next(new AppError('The reset password link has been expired.', 400));

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenCreatedAt = undefined;

  await user.save({ validateBeforeSave: true });

  const token = await signToken(user.id);

  res.status(200).json({ status: 'success', token, data: user });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const {
    password: currentPassword,
    newPassword,
    newPasswordConfirm,
  } = req.body;
  if (!currentPassword || !newPassword || !newPasswordConfirm)
    return next(
      new AppError(
        'Please provide valid fields (current password, new password and new password confirmation )',
      ),
    );

  const user = await User.findById(req.user._id).select('+password');
  if (!user)
    return next(
      new AppError(
        "Seems like the user doesn't exist but it wont ever reach this point ryt gemini because i am gonna use the protected routes ??????",
      ),
    );

  if (!user.checkPassword(currentPassword, user.password))
    return next(new AppError('The password is incorrect.'));

  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;

  await user.save({ validateBeforeSave: true });

  res.end('Hello');
});
