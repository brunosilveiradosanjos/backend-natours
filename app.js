const express = require('express')
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const app = express();

// 1) MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// 2) ROUTE HANDLERS

// 3) ROUTES

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

// 4) START SERVER

module.exports = app;