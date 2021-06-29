const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');
// By default each router only have access to the parameters of their specific routes
// This post comes from router.use('/:id/tourId/reviews', reviewRouter);
// So we can access tourId using mergeParams
const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.restrictTo('user'),
        reviewController.setTourUserIds,
        reviewController.createReview
    );

router
    .route('/:id')
    .get(reviewController.getOneReview)
    .delete(
        authController.restrictTo('user', 'admin'),
        reviewController.deleteReview
    )
    .patch(
        authController.restrictTo('user', 'admin'),
        reviewController.updateReview
    );

module.exports = router;