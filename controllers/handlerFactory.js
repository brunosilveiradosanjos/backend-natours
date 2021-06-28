const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
        return next(new AppError(`No document found with ID: ${req.params.id}`, 404))
    }
    res.status(200).json({
        status: 'success',
        data: {
            data: null
        }
    });
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        });

    if (!doc) {
        return next(new AppError(`No document found with ID: ${req.params.id}`, 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    });
});

exports.createOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            data: doc
        }
    });
});

exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) {
        query = query.populate(popOptions);
    }
    const doc = await query;

    if (!doc) {
        return next(new AppError(`No document found with ID: ${req.params.id}`, 404))
    }
    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    });
});

exports.getAll = (Model) => catchAsync(async (req, res, next) => {

    // To allow for nested GET reviews on tour (hack)
    let filter = {}
    if (req.params.tourId) {
        filter = { tour: req.params.tourId }
    }

    // We need a hard copy, if we just set const queryObj = req.query then if we delete something from queyrObj we would also delete id from .query object "..." is a shortcut for destructuring
    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    // console.log(features);
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        result: doc.length,
        data: {
            data: doc
        }
    });
});