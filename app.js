const fs = require('fs');
const express = require('express')
const morgan = require('morgan');
const app = express();

// 1) MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

const fileLocation = `${__dirname}/dev-data/data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(fileLocation));

// 2) ROUTE HANDLERS

// tours
const getAllTours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length,
        data: {
            tours: tours
        }
    })
};

const getOneTour = (req, res) => {
    const id = req.params.id * 1
    if (id > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }
    const tour = tours.find(el => el.id === id)
    res.status(200).json({
        status: 'success',
        data: {
            tours: tour
        }
    })
};

const createTour = (req, res) => {
    console.log(req.body);
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

const updateTour = (req, res) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here>'
        }
    })
};

const deleteTour = (req, res) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }
    res.status(204).json({
        status: 'success',
        data: null
    })
};

// users
const getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is note yet defined!'
    })
};

const getOneUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is note yet defined!'
    })
};

const createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is note yet defined!'
    })
};

const updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is note yet defined!'
    })
};

const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is note yet defined!'
    })
};

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getOneTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// 3) ROUTES
const tourRouter = express.Router();
const userRouter = express.Router();
// tours
tourRouter.route('/')
    .get(getAllTours)
    .post(createTour)

tourRouter.route('/:id')
    .get(getOneTour)
    .post(createTour)
    .patch(updateTour)
    .delete(deleteTour);

// users
userRouter.route('/')
    .get(getAllUsers)
    .post(createUser)

userRouter.route('/:id')
    .get(getOneUser)
    .post(createUser)
    .patch(updateUser)
    .delete(deleteUser);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

// START SERVER
const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}`)
})