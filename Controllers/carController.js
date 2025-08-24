const carModel = require("../models/carModel");

// Récupérer toutes les voitures
module.exports.getAllCars = async (req, res) => {
  try {
    const carsList = await carModel.find();
    res.status(200).json({ carsList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer une voiture par ID
module.exports.getCarById = async (req, res) => {
  try {
    const id = req.params.id;
    const car = await carModel.findById(id);
    
    if (!car) {
      return res.status(404).json({ message: "Voiture non trouvée" });
    }
    
    res.status(200).json({ car });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer une voiture par matricule
module.exports.getCarByMatricule = async (req, res) => {
  try {
    const matricule = req.params.matricule;
    const car = await carModel.findOne({ matricule: matricule.toUpperCase() });
    
    if (!car) {
      return res.status(404).json({ message: "Voiture non trouvée pour ce matricule" });
    }
    
    res.status(200).json({ car });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer les voitures par marque
module.exports.getCarsByBrand = async (req, res) => {
  try {
    const brand = req.params.brand;
    const cars = await carModel.find({ 
      brand: { $regex: brand, $options: "i" } 
    });
    
    if (cars.length === 0) {
      return res.status(404).json({ message: "Aucune voiture trouvée pour cette marque" });
    }
    
    res.status(200).json({ cars, count: cars.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer les voitures par gamme de prix
module.exports.getCarsByPriceRange = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.body;
    
    if (isNaN(minPrice) || isNaN(maxPrice)) {
      throw new Error("Les prix doivent être des nombres valides");
    }
    
    if (minPrice > maxPrice) {
      throw new Error("Le prix minimum doit être inférieur au prix maximum");
    }
    
    const cars = await carModel.find({
      price: { $gte: minPrice, $lte: maxPrice }
    }).sort({ price: 1 });
    
    res.status(200).json({ cars, count: cars.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer les voitures par année
module.exports.getCarsByYear = async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    
    if (isNaN(year)) {
      throw new Error("L'année doit être un nombre valide");
    }
    
    const cars = await carModel.find({ year: year });
    
    if (cars.length === 0) {
      return res.status(404).json({ message: "Aucune voiture trouvée pour cette année" });
    }
    
    res.status(200).json({ cars, count: cars.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer les voitures disponibles
module.exports.getAvailableCars = async (req, res) => {
  try {
    const cars = await carModel.find({ isAvailable: true, isSold: false });
    res.status(200).json({ cars, count: cars.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer toutes les voitures triées par prix
module.exports.getAllCarsSortedByPrice = async (req, res) => {
  try {
    const { order = 'asc' } = req.query;
    const sortOrder = order === 'desc' ? -1 : 1;
    
    const carsList = await carModel.find().sort({ price: sortOrder });
    const count = carsList.length;
    
    res.status(200).json({ count, carsList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Rechercher des voitures par nom de modèle
module.exports.searchCarsByModel = async (req, res) => {
  try {
    const { model } = req.body;
    
    if (!model) {
      throw new Error("Veuillez spécifier un modèle");
    }
    
    const carList = await carModel.find({
      model: { $regex: model, $options: "i" }
    });
    
    if (carList.length === 0) {
      throw new Error("Aucune voiture trouvée pour ce modèle");
    }
    
    res.status(200).json({ carList, count: carList.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ajouter une nouvelle voiture
module.exports.addCar = async (req, res) => {
  try {
    const carData = req.body;
    
    // Vérifier si le matricule existe déjà
    const existingCar = await carModel.findOne({ matricule: carData.matricule.toUpperCase() });
    if (existingCar) {
      return res.status(400).json({ message: "Une voiture avec ce matricule existe déjà" });
    }
    
    const car = new carModel(carData);
    const addedCar = await car.save();
    
    res.status(201).json({ addedCar });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ajouter une voiture avec image
module.exports.addCarWithImage = async (req, res) => {
  try {
    const carData = req.body;
    
    // Vérifier si le matricule existe déjà
    const existingCar = await carModel.findOne({ matricule: carData.matricule.toUpperCase() });
    if (existingCar) {
      return res.status(400).json({ message: "Une voiture avec ce matricule existe déjà" });
    }
    
    if (req.file) {
      const { filename } = req.file;
      carData.car_Image = filename;
    }
    
    const car = new carModel(carData);
    const addedCar = await car.save();
    
    res.status(201).json({ addedCar });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour une voiture
module.exports.updateCar = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    
    // Si le matricule est modifié, vérifier qu'il n'existe pas déjà
    if (updateData.matricule) {
      const existingCar = await carModel.findOne({ 
        matricule: updateData.matricule.toUpperCase(),
        _id: { $ne: id }
      });
      if (existingCar) {
        return res.status(400).json({ message: "Une voiture avec ce matricule existe déjà" });
      }
    }
    
    const updatedCar = await carModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedCar) {
      return res.status(404).json({ message: "Voiture non trouvée" });
    }
    
    res.status(200).json({ updatedCar });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Marquer une voiture comme vendue
module.exports.markCarAsSold = async (req, res) => {
  try {
    const id = req.params.id;
    
    const updatedCar = await carModel.findByIdAndUpdate(
      id,
      { isSold: true, isAvailable: false },
      { new: true }
    );
    
    if (!updatedCar) {
      return res.status(404).json({ message: "Voiture non trouvée" });
    }
    
    res.status(200).json({ updatedCar });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Changer le statut de disponibilité d'une voiture
module.exports.toggleCarAvailability = async (req, res) => {
  try {
    const id = req.params.id;
    
    const car = await carModel.findById(id);
    if (!car) {
      return res.status(404).json({ message: "Voiture non trouvée" });
    }
    
    car.isAvailable = !car.isAvailable;
    const updatedCar = await car.save();
    
    res.status(200).json({ updatedCar });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer une voiture
module.exports.deleteCarById = async (req, res) => {
  try {
    const id = req.params.id;
    const car = await carModel.findByIdAndDelete(id);
    
    if (!car) {
      return res.status(404).json({ message: "Voiture non trouvée" });
    }
    
    res.status(200).json({ message: "Voiture supprimée avec succès", deletedCar: car });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir les statistiques des voitures
module.exports.getCarStats = async (req, res) => {
  try {
    const totalCars = await carModel.countDocuments();
    const availableCars = await carModel.countDocuments({ isAvailable: true, isSold: false });
    const soldCars = await carModel.countDocuments({ isSold: true });
    
    // Prix moyen
    const avgPrice = await carModel.aggregate([
      { $group: { _id: null, avgPrice: { $avg: "$price" } } }
    ]);
    
    // Marques les plus populaires
    const popularBrands = await carModel.aggregate([
      { $group: { _id: "$brand", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    res.status(200).json({
      totalCars,
      availableCars,
      soldCars,
      averagePrice: avgPrice[0]?.avgPrice || 0,
      popularBrands
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const userModel = require("../models/userModel");

module.exports.addCarWithOwner = async (req, res) => {
  try {
    const carData = req.body;
    const idOwner = req.params.id;
    carData.owner = idOwner
    // Vérifier si le matricule existe déjà
    const existingCar = await carModel.findOne({ matricule: carData.matricule.toUpperCase() });
    if (existingCar) {
      return res.status(400).json({ message: "Une voiture avec ce matricule existe déjà" });
    }
    
    const car = new carModel(carData);
    const addedCar = await car.save();
    
    await userModel.findByIdAndUpdate(idOwner,{
      //$set :{car : addedCar._id}
      $push : {cars : addedCar._id}
    })

    res.status(201).json({ addedCar });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.affectCarToUser = async (req, res) => {
  try {
    const { carID,ownerID } = req.body;
    
    const user = await userModel.findById(ownerID)
    if(!user){
        throw new Error("user not found");        
    }

    const car = await carModel.findById(carID)
    if(!car){
        throw new Error("car not found");        
    }

    await carModel.findByIdAndUpdate(carID,{
        $set: { owner : ownerID}
        
    })
    await userModel.findByIdAndUpdate(ownerID,{
        //$set: { car : carID}
        $push : {cars : carID}
    })

    res.status(201).json({
      success: true,
      message: 'Voiture créée avec succès',
      data: "affected"
    });
  } catch (error) {
    console.error('Erreur lors de la création de la voiture:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la création de la voiture',
      error: error.message
    });
  }
};