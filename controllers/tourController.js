const fs = require('fs');

const fileLocation = `${__dirname}/../dev-data/data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(fileLocation));

// middlewere

exports.checkID = (req, res, next, val) => {
    // console.log(`Tour id is: ${val}`);
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }
    next();
}

exports.checkBody = ({ body }, res, next) => {

    if (body.name && body.duration && body.dificulty) {
        next();
    } else {
        res.status(404).json({
            status: 'fail',
            message: 'Missing name or price'
        })
    }

}

// tours
exports.getAllTours = (req, res) => {
    // console.log(req.requestTime);
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length,
        data: {
            tours: tours
        }
    })
};

exports.getOneTour = (req, res) => {
    const tour = tours.find(el => el.id === req.params.id * 1)
    res.status(200).json({
        status: 'success',
        data: {
            tours: tour
        }
    })
};

exports.createTour = (req, res) => {
    // console.log(req.body);
    const newId = tours[tours.length - 1] + 1;
    const newTour = Object.assign({ id: newId }, req.body);

    tours.push(newTour);

    fs.writeFile(
        fileLocation,
        JSON.stringify(tours),
        err => {
            res.status(201).json({
                status: 'success',
                data: {
                    tour: newTour
                }
            });
        });
};

exports.updateTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here>'
        }
    })
};

exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: 'success',
        data: null
    })
};