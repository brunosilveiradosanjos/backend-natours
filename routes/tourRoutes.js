const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const authController = require('./../controllers/authController');

// middlewere

// tours
router.route('/top-5-cheap')
    .get(tourController.aliasTopTour, tourController.getAllTours)

router.route('/tour-stats')
    .get(tourController.getTourStats)

router.route('/monthly-plan/:id')
    .get(tourController.getMonthlyPlan)

router.route('/')
    .get(authController.protect, tourController.getAllTours)
    // .post(tourController.checkBody, tourController.createTour)
    .post(tourController.createTour)

router.route('/:id')
    .get(tourController.getOneTour)
    .post(tourController.createTour)
    .patch(tourController.updateTour)
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.deleteTour
    );

module.exports = router;