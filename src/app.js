const fs = require('fs');
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

const tourDetails = JSON.parse(fs.readFileSync(`${__dirname}/data/tours.json`));

app.get("/tours", (req, res) => {
  // Get all tours
  let tours = tourDetails;
  res.send(tours);
});

app.post('/tours', (req, res) => {
  const { name, description, duration, price } = req.body;

  // Create new tour
  const newId = tourDetails.length > 0 ? tourDetails[tourDetails.length - 1].id + 1 : 1;
  const newTour = { id: newId, name, description, duration, price };
  tourDetails.push(newTour);

  // Save the updated data to tours.json
  fs.writeFileSync(`${__dirname}/data/tours.json`, JSON.stringify(tourDetails));
// tour: newTour
  res.status(200).json({ message: "Tour added successfully" });
});

app.put('/tours/:id', (req, res) => {
  const tourId = parseInt(req.params.id);
  const updatedTour = req.body;

  // Update a tour
  const index = tourDetails.findIndex((tour) => tour.id === tourId);
  if (index !== -1) {
    tourDetails[index] = { ...tourDetails[index], ...updatedTour };

    // Save the updated data to tours.json
    fs.writeFileSync(`${__dirname}/data/tours.json`, JSON.stringify(tourDetails));
    
 // tour: tourDetails[index],
    res.json({ message: "Tour updated successfully" });
  } else {
    res.status(404).json({ message: 'Tour not found' });
  }
});

app.delete('/tours/:id', (req, res) => {
  const tourId = parseInt(req.params.id);

  // Delete a tour
  const index = tourDetails.findIndex((tour) => tour.id === tourId);
  if (index !== -1) {
    const deletedTour = tourDetails.splice(index, 1)[0];

    // Save the updated data to tours.json
    fs.writeFileSync(`${__dirname}/data/tours.json`, JSON.stringify(tourDetails));
// , tour: deletedTour 
    res.json({ message: 'Tour deleted successfully'});
  } else {
    res.status(404).json({ message: 'Tour not found' });
  }
});

module.exports = app;
