const express = require('express');
const morgan = require('morgan');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/AppError');
const userRouter = require('./routes/userRouter');

const app = express();

// USING MORGAN MIDDLEWARE IN DEV MODE
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// USING THE BODY PARSER
app.use(express.json());

// HANDELING ROUTES
app.use('/user', userRouter);

// HANDELING UNHANDELED ROUTE
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// USING GLOBAL ERROR HANDELING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
