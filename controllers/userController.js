const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError');

const filterObj = (obj, ...allowedFields) => {

    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    })
    return newObj;
}

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

exports.updateMe = async (req, res, next) => {
    // 1) Create error if user POSTs passord data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates. Please use /updatePassword'), 400);
    }
    // 2) Filtered out unwanted field names that are not allowerd to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');
    // 3) Update user document
    const UpdatedUser = await User.findByIdAndUpdate(
        req.user.id,
        filteredBody,
        {
            new: true,
            runValidators: true
        });

    // await user.save();
    res.status(200).json({
        status: 'success',
        user: UpdatedUser
    })
}

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null
    })
})

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