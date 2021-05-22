const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
// users
exports.getAllUsers = catchAsync(async (req, res, next) => {

    const users = await User.find();

    res.status(200).json({
        status: 'success',
        data: {
            users
        }
    })
});

exports.getOneUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is note yet defined!'
    })
};

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is note yet defined!'
    })
};

exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is note yet defined!'
    })
};

exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is note yet defined!'
    })
};