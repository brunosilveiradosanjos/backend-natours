const Tour = require('../models/tourModel');

// middlewere

// tours
exports.getAllTours = (req, res) => {
    res.status(200).json({})
};

exports.getOneTour = (req, res) => {
    res.status(200).json({})
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