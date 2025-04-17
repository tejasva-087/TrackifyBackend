const express = require('express');
const morgan = require('morgan');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/AppError');

const app = express();

// USING MORGAN MIDDLEWARE IN DEV MODE
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// USING THE BODY PARSER
app.use(express.json());

// HANDLING ROUTES
// app.use('/user', userRouter);

// HANDLING UNHANDLED ROUTE
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// USING GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
