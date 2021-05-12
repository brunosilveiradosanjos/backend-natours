const Tour = require('../models/tourModel');

// middlewere

// tours
exports.getAllTours = async (req, res) => {
    try {
        // We need a hard copy, if we just set const queryObj = req.query then if we delete something from queyrObj we would also delete id from .query object "..." is a shortcut for destructuring

        // BUILD QUERY

        // 1A)Filtering
        const queryObj = { ...req.query };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach(el => delete queryObj[el]);
        // console.log(excludeFields, queryObj);

        // 1B)Advanced Filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        let query = Tour.find(JSON.parse(queryStr));

        // 2) Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            console.log(sortBy);
            query = query.sort(sortBy);
            // sort('price')
        }
        console.log(req.query);
        console.log(JSON.parse(queryStr));


        // EXECUTE QUERY
        const tours = await query;

        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            result: tours.length,
            data: {
                tours
            }
        });

    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: `Something went wrong: ${err}`
        });
    }
};

exports.getOneTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: `Something went wrong: ${err}`
        });
    }
};

exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: `You got an error: ${err}`
        })
    }
};

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: `Something went wrong: ${err}`
        });
    }
};

exports.deleteTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: `Something went wrong: ${err}`
        });
    }
};