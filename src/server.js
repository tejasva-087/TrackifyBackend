require('dotenv').config({ path: `${__dirname}/config.env` });
const mongoose = require('mongoose');

const app = require('./app');

// HANDELING UNCAUGHT SYNCHRONUS EXCEPTIONS
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION 💥');
  console.log(err.name, err.message);
  process.exit(1);
});

// HANDELING DATABASE CONNECTIVITY
const databaseString =
  process.env.NODE_ENV === 'development'
    ? process.env.DATABASE_DEV
    : process.env.DATABASE_PROD;

mongoose
  .connect(databaseString)
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.log('DATABASE NOT CONNECTED');
    console.log(err);
    process.exit(1);
  });

// STARTING THE SERVER
const server = app.listen(process.env.PORT, () => {
  console.log(`server started on port ${process.env.PORT}`);
});

// HANDELING UNCAUGHT ASYNCHRONUS EXCEPTIONS
process.on('unhandeledRejection', (err) => {
  console.log('UNHANDELET REJECTION 💥');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
