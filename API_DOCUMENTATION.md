# Documentation des API - Gestion des Voitures

## Base URL
```
http://localhost:3000/cars
```

## Endpoints disponibles

### 1. Récupération des données (GET)

#### Récupérer toutes les voitures
```
GET /cars/getAllCars
```
**Réponse :**
```json
{
  "carsList": [
    {
      "_id": "...",
      "matricule": "123-ABC-5678",
      "model": "Clio",
      "color": "rouge",
      "brand": "Renault",
      "year": 2020,
      "price": 15000,
      "mileage": 50000,
      "fuelType": "essence",
      "transmission": "manuelle",
      "isAvailable": true,
      "isSold": false,
      "car_Image": "default-car.png",
      "description": "Voiture en excellent état",
      "features": ["Climatisation", "GPS"],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Récupérer une voiture par ID
```
GET /cars/getCarById/:id
```
**Paramètres :**
- `id` : ID MongoDB de la voiture

#### Récupérer une voiture par matricule
```
GET /cars/getCarByMatricule/:matricule
```
**Paramètres :**
- `matricule` : Matricule de la voiture (ex: 123-ABC-5678)

#### Récupérer les voitures par marque
```
GET /cars/getCarsByBrand/:brand
```
**Paramètres :**
- `brand` : Nom de la marque (ex: Renault)

#### Récupérer les voitures par année
```
GET /cars/getCarsByYear/:year
```
**Paramètres :**
- `year` : Année de fabrication

#### Récupérer les voitures disponibles
```
GET /cars/getAvailableCars
```

#### Récupérer toutes les voitures triées par prix
```
GET /cars/getAllCarsSortedByPrice?order=asc
```
**Paramètres de requête :**
- `order` : "asc" (croissant) ou "desc" (décroissant)

#### Obtenir les statistiques des voitures
```
GET /cars/getCarStats
```
**Réponse :**
```json
{
  "totalCars": 50,
  "availableCars": 35,
  "soldCars": 15,
  "averagePrice": 18500,
  "popularBrands": [
    { "_id": "Renault", "count": 12 },
    { "_id": "Peugeot", "count": 10 }
  ]
}
```

### 2. Création et recherche (POST)

#### Ajouter une nouvelle voiture
```
POST /cars/addCar
```
**Corps de la requête :**
```json
{
  "matricule": "123-ABC-5678",
  "model": "Clio",
  "color": "rouge",
  "brand": "Renault",
  "year": 2020,
  "price": 15000,
  "mileage": 50000,
  "fuelType": "essence",
  "transmission": "manuelle",
  "description": "Voiture en excellent état",
  "features": ["Climatisation", "GPS"]
}
```

#### Ajouter une voiture avec image
```
POST /cars/addCarWithImage
```
**Corps de la requête :** FormData avec image
- `car_Image` : Fichier image
- Autres champs : données de la voiture

#### Rechercher des voitures par gamme de prix
```
POST /cars/getCarsByPriceRange
```
**Corps de la requête :**
```json
{
  "minPrice": 10000,
  "maxPrice": 20000
}
```

#### Rechercher des voitures par modèle
```
POST /cars/searchCarsByModel
```
**Corps de la requête :**
```json
{
  "model": "Clio"
}
```

### 3. Mise à jour (PUT)

#### Mettre à jour une voiture
```
PUT /cars/updateCar/:id
```
**Paramètres :**
- `id` : ID MongoDB de la voiture

**Corps de la requête :** Champs à mettre à jour
```json
{
  "price": 16000,
  "description": "Nouvelle description"
}
```

#### Marquer une voiture comme vendue
```
PUT /cars/markCarAsSold/:id
```

#### Changer le statut de disponibilité
```
PUT /cars/toggleCarAvailability/:id
```

### 4. Suppression (DELETE)

#### Supprimer une voiture
```
DELETE /cars/deleteCarById/:id
```
**Paramètres :**
- `id` : ID MongoDB de la voiture

## Validation des données

### Format du matricule
Le matricule doit suivre le format : `XXX-XXX-XXXX`
- 3 chiffres, tiret, 3 lettres, tiret, 4 chiffres
- Exemple : `123-ABC-5678`

### Couleurs autorisées
- rouge, bleu, vert, noir, blanc, gris, jaune, orange, violet, marron

### Types de carburant
- essence, diesel, électrique, hybride, gpl

### Transmission
- manuelle, automatique

### Validation des prix et kilométrage
- Prix et kilométrage doivent être des nombres positifs
- L'année doit être entre 1900 et l'année suivante

## Gestion des erreurs

### Codes de statut HTTP
- `200` : Succès
- `201` : Créé avec succès
- `400` : Requête invalide
- `404` : Ressource non trouvée
- `500` : Erreur serveur

### Format des erreurs
```json
{
  "message": "Description de l'erreur"
}
```

## Exemples d'utilisation

### Créer une voiture
```bash
curl -X POST http://localhost:3000/cars/addCar \
  -H "Content-Type: application/json" \
  -d '{
    "matricule": "123-ABC-5678",
    "model": "Clio",
    "color": "rouge",
    "brand": "Renault",
    "year": 2020,
    "price": 15000,
    "mileage": 50000,
    "fuelType": "essence",
    "transmission": "manuelle"
  }'
```

### Récupérer toutes les voitures
```bash
curl http://localhost:3000/cars/getAllCars
```

### Mettre à jour une voiture
```bash
curl -X PUT http://localhost:3000/cars/updateCar/64f1a2b3c4d5e6f7g8h9i0j1 \
  -H "Content-Type: application/json" \
  -d '{"price": 16000}'
```

### Supprimer une voiture
```bash
curl -X DELETE http://localhost:3000/cars/deleteCarById/64f1a2b3c4d5e6f7g8h9i0j1
```

## Notes importantes

1. **Matricule unique** : Chaque voiture doit avoir un matricule unique
2. **Validation automatique** : Les données sont automatiquement validées selon le schéma
3. **Timestamps** : Chaque voiture a des champs `createdAt` et `updatedAt` automatiques
4. **Images** : Les images sont gérées via le middleware `uploadFile`
5. **Index** : Des index sont créés sur les champs fréquemment recherchés pour optimiser les performances
