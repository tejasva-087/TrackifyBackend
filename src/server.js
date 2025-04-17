require('dotenv').config({ path: `${__dirname}/config.env` });
const mongoose = require('mongoose');

const app = require('./app');

// HANDLING UNCAUGHT SYNCHRONOUS EXCEPTIONS
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION 💥');
  console.log(err.name, err.message);
  process.exit(1);
});

// HANDLING DATABASE CONNECTIVITY
const databaseString =
  process.env.NODE_ENV === 'development'
    ? process.env.DATABASE_DEV
    : process.env.DATABASE_PROD.replace(
        '<DATABASE-PASSWORD>',
        process.env.DATABASE_PASSWORD,
      );

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

// HANDLING UNCAUGHT ASYNCHRONOUS EXCEPTIONS
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION 💥');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
