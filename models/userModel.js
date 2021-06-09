const crypto = require('crypto');
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
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
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
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
});

userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    // Delete passwordConfirm field
    this.passwordConfirm = undefined;

    next();

})

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    // Putting this passwordChangedAt one second in the past will ensure 
    // that the token is always created after the password has been changed
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPasswrod) {
    const teste = await bcrypt.compare(candidatePassword, userPasswrod);
    console.log(`from correctPassword candidatePassword: ${candidatePassword}, userPasswrod: ${userPasswrod}, ${teste}`);
    return await bcrypt.compare(candidatePassword, userPasswrod)
};

userSchema.methods.changesPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        // console.log('HELLO', changedTimestamp, this.passwordChangedAt, JWTTimestamp);
        return (JWTTimestamp < changedTimestamp)
    }
    return false;
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Store passwordResetToken to compare when the user send the updated password + token
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    console.log({ resetToken }, this.passwordResetToken);
    this.passwordResetExpires = Date.now() + (5 * 60 * 1000);

    return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;