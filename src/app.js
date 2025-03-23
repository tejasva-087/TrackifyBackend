const express = require("express");
const morgan = require("morgan");

const app = express();

// USING MORGAN MIDDLEWARE IN DEV MODE
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// USING THE BODY PARSER
app.use(express.json());

module.exports = app;
