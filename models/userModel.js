const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'You must provide a user name'],
        trim: true,
        maxlength: [40, 'A tour name must have less or equal then 40 to characters'],
        minlength: [10, 'A tour name must have more or equal then 10 to characters']
    },
    email: {
        type: String,
        required: [true, 'You must provide a user email'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'You must provide a user password'],
        minlength: 8
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password']
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;

