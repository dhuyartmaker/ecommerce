require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const { checkOverload } = require('./helpers/check-connect');
const route = require('./routers');

const app = express();

// Init DB
require('./dbs/initDb');
require('./services/redis.service')

app.use(morgan("dev"))
app.use(helmet())
app.use(compression({ filter: shouldCompress }))
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use('/', route)

app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    console.log("==error==", error)
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message
    })
})

function shouldCompress (req, res) {
    if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false
    }
    // fallback to standard filter function
    return compression.filter(req, res)
}

checkOverload()

module.exports = app;