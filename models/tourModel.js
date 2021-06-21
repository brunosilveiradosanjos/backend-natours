const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
// const User = require('./userModel')

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A Tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less or equal then 40 to characters'],
        minlength: [10, 'A tour name must have more or equal then 10 to characters']
        // validate: [validator.isAlpha, 'A Tour name must only contain characters']
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be above 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A Tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                // this only points to current doc on NEW document creation, not works with updates
                return val < this.price;
            },
            message: 'Discount price should be below regular price'
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A Tour must have a summary']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A Tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },
    startLocation: {
        // GeoJSON
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    // guides: Array
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// VIRTUAL PROPERTIES return duration in weeks
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7
})

// DOCUMENT MIDDLEWARE: runs berofe .save() and .create()
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// tourSchema.pre('save', async function (next) {
//     // Implementing embeding for tour guides
//     const guidesPromises = this.guides.map(async id => await User.findById(id));
//     this.guides = await Promise.all(guidesPromises);
//     next();
// })

// QUERY MIDDLEWARE 
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } })
    this.start = Date.now();
    next();
});

tourSchema.post(/^find/, function (docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds!`);
    // console.log(docs);
    next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
    // adding to all aggregate middleware to auto exclude secretTour with this filter
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
    // console.log(this.pipeline());
    next();
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

