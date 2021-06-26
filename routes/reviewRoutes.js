const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');
// By default each router only have access to the parameters of their specific routes
// This post comes from router.use('/:id/tourId/reviews', reviewRouter);
// So we can access tourId using mergeParams
const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.protect,
        authController.restrictTo('user'),
        reviewController.createReview
    );

router
    .route('/:id')
    .delete(reviewController.deleteReview);

module.exports = router;