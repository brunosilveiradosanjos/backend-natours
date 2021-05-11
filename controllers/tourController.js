const Tour = require('../models/tourModel');

// middlewere

// tours
exports.getAllTours = async (req, res) => {

    try {

        const tours = await Tour.find();
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

exports.updateTour = (req, res) => {
    res.status(200).json({})
};

exports.deleteTour = (req, res) => {
    res.status(204).json({})
};