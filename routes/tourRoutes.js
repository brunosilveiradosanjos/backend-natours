const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const authController = require('./../controllers/authController');
// const reviewController = require('./../controllers/reviewController');
const reviewRouter = require('./../routes/reviewRoutes');

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
// POST /tour/0dcv0vdSD87VDS89/reviews
// GET  /tour/0dcv0vdSD87VDS89/reviews
router.use('/:tourId/reviews', reviewRouter);

// router
//     .route('/:tourId/reviews')
//     .post(
//         authController.protect,
//         authController.restrictTo('user'),
//         reviewController.createReview
//     )

module.exports = router;