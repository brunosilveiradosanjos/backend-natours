const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
        return next(new AppError(`No document found with ID: ${req.params.id}`, 404))
    }
    res.status(200).json({
        status: 'success',
        data: {
            doc
        }
    });
});