var express = require('express');
var router = express.Router();

const carController = require("../Controllers/carController");
const uploadfile = require("../middlewares/uploadFile");

// Routes GET - Récupération des données
router.get('/getAllCars', carController.getAllCars);
router.get('/getAllCarsSortedByPrice', carController.getAllCarsSortedByPrice);
router.get('/getAvailableCars', carController.getAvailableCars);
router.get('/getCarById/:id', carController.getCarById);
router.get('/getCarByMatricule/:matricule', carController.getCarByMatricule);
router.get('/getCarsByBrand/:brand', carController.getCarsByBrand);
router.get('/getCarsByYear/:year', carController.getCarsByYear);
router.get('/getCarStats', carController.getCarStats);

// Routes POST - Création et recherche
router.post('/addCarWithOwner/:id', carController.addCarWithOwner);
router.post('/addCar', carController.addCar);
router.post('/addCarWithImage', uploadfile.single("car_Image"), carController.addCarWithImage);
router.post('/getCarsByPriceRange', carController.getCarsByPriceRange);
router.post('/searchCarsByModel', carController.searchCarsByModel);

// Routes PUT - Mise à jour
router.put('/updateCar/:id', carController.updateCar);
router.put('/markCarAsSold/:id', carController.markCarAsSold);
router.put('/toggleCarAvailability/:id', carController.toggleCarAvailability);

// Routes DELETE - Suppression
router.delete('/deleteCarById/:id', carController.deleteCarById);

module.exports = router;
