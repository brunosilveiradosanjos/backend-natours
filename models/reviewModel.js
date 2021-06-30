// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');
const Tour = require('./tourModel');

reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'review can not be empty!']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belog to a tour']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belog to a user']
    }
},
    // Whenever we have a virtual output property as a field that is 
    // not stored in the database, but calculated using some other value.
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

reviewSchema.pre(/^find/, function (next) {
    // this.populate({
    //     path: 'tour',
    //     select: 'name'
    // }).populate({
    //     path: 'user',
    //     select: 'name photo'
    // });
    this.populate({
        path: 'user',
        select: 'name photo'
    });
    next();
});

reviewSchema.statics.calcAverageRating = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);
    // console.log(`stats `, stats);
    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsAverage: stats[0].nRating,
            ratingsQuantity: stats[0].avgRating
        });
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsAverage: 0,
            ratingsQuantity: 4.5
        });
    }
}

reviewSchema.post('save', function (next) {
    // this points to current review
    // constructor here stands for the tour
    this.constructor.calcAverageRating(this.tour);
    // Here the review variable is not yet defined. 
    // Review.calcAverageRating(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne();
    next();
})

reviewSchema.post(/^findOneAnd/, async function (next) {
    // this.r = await this.findOne(); does NOT work here, query has already executed
    await this.r.constructor.calcAverageRating(this.r.tour);
})


const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;