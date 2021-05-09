const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');

// middlewere
router.param('id', tourController.checkID);

// tours
router.route('/')
    .get(tourController.getAllTours)
    .post(tourController.createTour)

router.route('/:id')
    .get(tourController.getOneTour)
    .post(tourController.createTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;