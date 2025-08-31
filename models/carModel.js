const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  matricule: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    match: [/^[0-9]{3}-[A-Z]{3}-[0-9]{4}$/, "Format de matricule invalide (ex: 123-ABC-5678)"],
  },
  model: {
    type: String,
    required: true,
    trim: true,
  },
  color: {
    type: String,
    required: true,
    enum: ["rouge", "bleu", "vert", "noir", "blanc", "gris", "jaune", "orange", "violet", "marron"],
  },
  brand: {
    type: String,
    required: true,
    trim: true,
  },
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  mileage: {
    type: Number,
    required: true,
    min: 0,
  },
  fuelType: {
    type: String,
    required: true,
    enum: ["essence", "diesel", "électrique", "hybride", "gpl"],
  },
  transmission: {
    type: String,
    required: true,
    enum: ["manuelle", "automatique"],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  isSold: {
    type: Boolean,
    default: false,
  },
  car_Image: {
    type: String,
    required: false,
    default: "default-car.png",
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  features: [{
    type: String,
    trim: true,
  }],
  owner: {type : mongoose.Schema.Types.ObjectId , ref:'User'}, //one

  //  owners: [{type : mongoose.Schema.Types.ObjectId , ref:'User'}] //Many

}, { timestamps: true });

// Index pour améliorer les performances de recherche
carSchema.index({ brand: 1, model: 1 });
carSchema.index({ price: 1 });
carSchema.index({ year: 1 });

const Car = mongoose.model('Car', carSchema);
module.exports = Car;