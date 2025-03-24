const express = require('express');
const morgan = require('morgan');

const globalErrorHandler = require('./controllers/errorController');

const app = express();

// USING MORGAN MIDDLEWARE IN DEV MODE
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// USING THE BODY PARSER
app.use(express.json());

// HANDELING UNHANDELED ROUTE
app.all('*', (req, res, next) => {
  console.log('Hello');
});

// USING GLOBAL ERROR HANDELING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
