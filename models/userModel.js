const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')

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
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    }
});

userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    // Delete passwordConfirm field
    this.passwordConfirm = undefined;

    next();

})

userSchema.methods.correctPassword = async function (candidatePassword, userPasswrod) {
    return await bcrypt.compare(candidatePassword, userPasswrod)
}

const User = mongoose.model('User', userSchema);

module.exports = User;