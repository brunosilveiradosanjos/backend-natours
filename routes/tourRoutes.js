const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');

// middlewere

// tours
router.route('/')
    .get(tourController.getAllTours)
    // .post(tourController.checkBody, tourController.createTour)
    .post(tourController.createTour)

router.route('/:id')
    .get(tourController.getOneTour)
    .post(tourController.createTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;