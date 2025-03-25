const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const AppError = require('../utils/AppError');

exports.signUp = async (req, res, next) => {
  try {
    // 1) creating new user
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    });

    // creating a jwt token
    const token = jwt.sign(
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
      data: {
        status: 'success',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = (req, res, next) => {
  try {
    // checking if the provided credentials exist or not
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }
    res.end('Hello');
  } catch (err) {
    next(err);
  }
};
