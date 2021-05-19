const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');

// middlewere

// tours
router.route('/top-5-cheap')
    .get(tourController.aliasTopTour, tourController.getAllTours)

router.route('/tour-stats')
    .get(tourController.getTourStats)

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