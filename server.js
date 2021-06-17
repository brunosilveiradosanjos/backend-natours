const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' })


// Handle Global uncaught exception
process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log('UNCAUGHT EXCEPTION! 💥 Shuting down...');
    process.exit(1)
})

const app = require('./app');
// console.log(process.env);
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(con => {
    // console.log(con.connections);
    console.log('DB connection successful!');
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}`)
})

// Handle Global Promise rejection
process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('UNHANDLE REJECTION! 💥 Shuting down...');
    server.close(() => {
        process.exit(1)
    });
});