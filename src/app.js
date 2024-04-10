const express = require('express');
const morgan  = require('morgan');
const app = express();

// init middleware
app.use(morgan("dev"))

// init database

// init routes

// handle error

module.exports = app