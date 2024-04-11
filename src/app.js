const express = require('express');
const morgan  = require('morgan');
const helmet = require("helmet");
const compression = require("compression");
const app = express();

// init middleware
app.use(morgan("dev"))
app.use(helmet());
app.use(compression());

// init database

// init routes
app.get('/', (req, res, next) => {
    return res.status(500).json({
        message: "welcome fantipjs"
    })
})


// handle error

module.exports = app