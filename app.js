const express = require('express')
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express();

// 1) GLOBAL MIDDLEWARES

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV == 'development') {
    console.log('Morgan: ', process.env.NODE_ENV);
    app.use(morgan('dev'));
}

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again soon!'
});
// Limit requests from same API
app.use('/api', limiter);
// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
// Data sanitization against NoSQL query injection
app.use(mongoSanitize()); //"email": {"$gt":""},
// Data sanitization against XSS
app.use(xss()); // convert html simbols
// Prevent parameter pollution
app.use(hpp({
    whitelist: ['duration', 'ratingsAverage', , 'ratingsQuantity', 'maxGroupSize', 'difficulty', 'price']
}));
// Serving static files
app.use(express.static(`${__dirname}/public`));
// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log(req.headers);
    next();
});

// 2) ROUTE HANDLERS

// 3) ROUTES

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

app.all('*', (req, res, next) => {
    res.status(404).json({
        staus: 'fail',
        message: `Cant't find ${req.originalUrl} on this server!`
    })
})

// 4) START SERVER

module.exports = app;