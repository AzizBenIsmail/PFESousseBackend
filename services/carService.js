const carModel = require('../models/carModel');

class CarService {
  // Créer une nouvelle voiture
  async createCar(carData) {
    try {
      // Vérifier si le matricule existe déjà
      const existingCar = await carModel.findOne({ 
        matricule: carData.matricule.toUpperCase() 
      });
      
      if (existingCar) {
        throw new Error('Une voiture avec ce matricule existe déjà');
      }
      
      const car = new carModel(carData);
      return await car.save();
    } catch (error) {
      throw error;
    }
  }

  // Récupérer toutes les voitures
  async getAllCars() {
    try {
      return await carModel.find();
    } catch (error) {
      throw error;
    }
  }

  // Récupérer une voiture par ID
  async getCarById(id) {
    try {
      const car = await carModel.findById(id);
      if (!car) {
        throw new Error('Voiture non trouvée');
      }
      return car;
    } catch (error) {
      throw error;
    }
  }

  // Récupérer une voiture par matricule
  async getCarByMatricule(matricule) {
    try {
      const car = await carModel.findOne({ 
        matricule: matricule.toUpperCase() 
      });
      
      if (!car) {
        throw new Error('Voiture non trouvée pour ce matricule');
      }
      
      return car;
    } catch (error) {
      throw error;
    }
  }

  // Rechercher des voitures par critères
  async searchCars(criteria) {
    try {
      const query = {};
      
      if (criteria.brand) {
        query.brand = { $regex: criteria.brand, $options: 'i' };
      }
      
      if (criteria.model) {
        query.model = { $regex: criteria.model, $options: 'i' };
      }
      
      if (criteria.color) {
        query.color = criteria.color;
      }
      
      if (criteria.minPrice || criteria.maxPrice) {
        query.price = {};
        if (criteria.minPrice) query.price.$gte = criteria.minPrice;
        if (criteria.maxPrice) query.price.$lte = criteria.maxPrice;
      }
      
      if (criteria.year) {
        query.year = criteria.year;
      }
      
      if (criteria.fuelType) {
        query.fuelType = criteria.fuelType;
      }
      
      if (criteria.transmission) {
        query.transmission = criteria.transmission;
      }
      
      if (criteria.isAvailable !== undefined) {
        query.isAvailable = criteria.isAvailable;
      }
      
      return await carModel.find(query);
    } catch (error) {
      throw error;
    }
  }

  // Mettre à jour une voiture
  async updateCar(id, updateData) {
    try {
      // Si le matricule est modifié, vérifier qu'il n'existe pas déjà
      if (updateData.matricule) {
        const existingCar = await carModel.findOne({ 
          matricule: updateData.matricule.toUpperCase(),
          _id: { $ne: id }
        });
        
        if (existingCar) {
          throw new Error('Une voiture avec ce matricule existe déjà');
        }
      }
      
      const updatedCar = await carModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!updatedCar) {
        throw new Error('Voiture non trouvée');
      }
      
      return updatedCar;
    } catch (error) {
      throw error;
    }
  }

  // Supprimer une voiture
  async deleteCar(id) {
    try {
      const car = await carModel.findByIdAndDelete(id);
      
      if (!car) {
        throw new Error('Voiture non trouvée');
      }
      
      return car;
    } catch (error) {
      throw error;
    }
  }

  // Obtenir les statistiques des voitures
  async getCarStats() {
    try {
      const totalCars = await carModel.countDocuments();
      const availableCars = await carModel.countDocuments({ 
        isAvailable: true, 
        isSold: false 
      });
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
      
      return {
        totalCars,
        availableCars,
        soldCars,
        averagePrice: avgPrice[0]?.avgPrice || 0,
        popularBrands
      };
    } catch (error) {
      throw error;
    }
  }

  // Marquer une voiture comme vendue
  async markCarAsSold(id) {
    try {
      const updatedCar = await carModel.findByIdAndUpdate(
        id,
        { isSold: true, isAvailable: false },
        { new: true }
      );
      
      if (!updatedCar) {
        throw new Error('Voiture non trouvée');
      }
      
      return updatedCar;
    } catch (error) {
      throw error;
    }
  }

  // Changer le statut de disponibilité d'une voiture
  async toggleCarAvailability(id) {
    try {
      const car = await carModel.findById(id);
      
      if (!car) {
        throw new Error('Voiture non trouvée');
      }
      
      car.isAvailable = !car.isAvailable;
      return await car.save();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new CarService();
