const fs = require('fs');
const express = require('express')
const app = express();
// important
app.use(express.json());

const fileLocation = `${__dirname}/dev-data/data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(fileLocation));

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours: tours
        }
    })
})

app.get('/api/v1/tours/:id', (req, res) => {
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
})

app.post('/api/v1/tours', (req, res) => {
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

})

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}`)
})