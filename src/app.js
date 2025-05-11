const express = require('express');
const morgan = require('morgan');
const sanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

const userRouter = require('./routes/userRoutes');
const transactionRouter = require('./routes/transactionRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const app = express();

// SETTING THE SECURITY HEADERS
app.use(helmet());

// USING MORGAN MIDDLEWARE IN DEV MODE
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// RATE LIMITING
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// USING THE BODY PARSER
app.use(express.json({ limit: '10kb' }));

// DATA SANITIZATION
app.use(sanitize());

// PREVENTING CROSS SITE SCRIPTING
app.use(xss());

// PREVENTING THE PARAMETER POLLUTION
app.use(hpp());

// HANDLING ROUTES
app.use('/api/v1/user', userRouter);
app.use('/api/v1/transaction', transactionRouter);

// HANDLING UNHANDLED ROUTE
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// USING GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
