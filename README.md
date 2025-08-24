# 🚗 PFESousse - API de Gestion Automobile

## 📋 Description du Projet

**PFESousse** est une API REST complète développée en Node.js pour la gestion d'un parc automobile. Cette application permet de gérer les utilisateurs, les voitures et les ordres de service avec une architecture modulaire et des fonctionnalités avancées.

## ✨ Fonctionnalités Principales

### 🔐 Gestion des Utilisateurs
- **Authentification sécurisée** avec bcrypt
- **Rôles multiples** : client, admin, etc.
- **Gestion des profils** avec images
- **Validation des données** robuste
- **Recherche et filtrage** avancés

### 🚗 Gestion des Voitures
- **CRUD complet** pour le parc automobile
- **Validation des matricules** (format XXX-XXX-XXXX)
- **Gestion des statuts** (disponible, vendue, etc.)
- **Recherche multicritères** (marque, modèle, prix, année)
- **Upload d'images** avec gestion des doublons
- **Statistiques avancées** du parc

### 📋 Gestion des Ordres de Service
- **Suivi des interventions** automobiles
- **Gestion des réparations** et maintenances
- **Historique des services** rendus

## 🏗️ Architecture du Projet

```
PFESousse/
├── 📁 config/                 # Configuration de la base de données
├── 📁 Controllers/            # Contrôleurs de l'application
├── 📁 middlewares/            # Middlewares personnalisés
├── 📁 models/                 # Modèles Mongoose
├── 📁 public/                 # Fichiers statiques et images
├── 📁 routes/                 # Définition des routes
├── 📁 services/               # Logique métier
├── 📄 app.js                  # Point d'entrée de l'application
├── 📄 package.json            # Dépendances et scripts
└── 📄 README.md               # Documentation du projet
```

## 🚀 Technologies Utilisées

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB

### Sécurité & Utilitaires
- **bcrypt** - Hachage des mots de passe
- **multer** - Gestion des uploads de fichiers
- **dotenv** - Variables d'environnement
- **morgan** - Logging des requêtes HTTP

### Développement
- **nodemon** - Redémarrage automatique en développement
- **ES6+** - Fonctionnalités JavaScript modernes

## 📦 Installation et Configuration

### Prérequis
- **Node.js** (version 14 ou supérieure)
- **MongoDB** (version 4.4 ou supérieure)
- **npm** ou **yarn**

### 1. Cloner le projet
```bash
git clone <url-du-repo>
cd PFESousse
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration des variables d'environnement
Créer un fichier `.env` à la racine du projet :
```env
# Configuration du serveur
Port=3000

# Configuration de la base de données MongoDB
Url_Db=mongodb://localhost:27017/pfesousse

# Autres variables d'environnement
NODE_ENV=development
```

### 4. Démarrer l'application
```bash
# Mode développement (avec nodemon)
npm run dev

# Mode production
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 🗄️ Structure de la Base de Données

### Modèle Utilisateur (User)
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique, requis),
  password: String (min 12 caractères, validation complexe),
  role: String (enum: "client", "admin", ".."),
  age: Number,
  user_Image: String (défaut: "client.png"),
  isActive: Boolean,
  isBanned: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Modèle Voiture (Car)
```javascript
{
  matricule: String (unique, format XXX-XXX-XXXX),
  model: String (requis),
  color: String (enum des couleurs),
  brand: String (requis),
  year: Number (1900-année+1),
  price: Number (positif),
  mileage: Number (positif),
  fuelType: String (enum: essence, diesel, électrique, hybride, gpl),
  transmission: String (enum: manuelle, automatique),
  isAvailable: Boolean (défaut: true),
  isSold: Boolean (défaut: false),
  car_Image: String (défaut: "default-car.png"),
  description: String (max 500 caractères),
  features: [String],
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Base URL
```
http://localhost:3000
```

### Routes Principales
- **`/`** - Page d'accueil
- **`/users`** - Gestion des utilisateurs
- **`/cars`** - Gestion des voitures
- **`/os`** - Gestion des ordres de service

### Documentation Complète
Consultez le fichier `API_DOCUMENTATION.md` pour une documentation détaillée de tous les endpoints.

## 🔧 Fonctionnalités Avancées

### Gestion des Images
- **Upload automatique** dans `public/images/`
- **Gestion des doublons** avec suffixe numérique
- **Support de multiples formats** d'image
- **Stockage organisé** par type d'entité

### Validation des Données
- **Validation Mongoose** avec schémas stricts
- **Validation personnalisée** pour les matricules
- **Gestion des erreurs** centralisée
- **Messages d'erreur** en français

### Sécurité
- **Hachage des mots de passe** avec bcrypt
- **Validation des entrées** utilisateur
- **Gestion des sessions** sécurisée
- **Protection contre les injections** MongoDB

## 📊 Fonctionnalités de Recherche

### Utilisateurs
- Recherche par nom/prénom
- Filtrage par âge
- Tri par différents critères
- Pagination des résultats

### Voitures
- Recherche par matricule
- Filtrage par marque, modèle, couleur
- Recherche par gamme de prix
- Filtrage par année et type de carburant
- Statistiques du parc automobile

## 🚀 Scripts Disponibles

```json
{
  "start": "node app",           // Démarrage en production
  "dev": "nodemon app"          // Démarrage en développement
}
```

## 🔍 Développement

### Structure des Contrôleurs
Chaque contrôleur suit le pattern :
```javascript
module.exports.functionName = async (req, res) => {
  try {
    // Logique métier
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### Gestion des Erreurs
- **Middleware d'erreur** global
- **Codes de statut HTTP** appropriés
- **Messages d'erreur** informatifs
- **Logging** des erreurs

### Middlewares
- **Morgan** : Logging des requêtes
- **Multer** : Gestion des uploads
- **Cookie-parser** : Gestion des cookies
- **Express.json** : Parsing du JSON

## 📁 Organisation des Fichiers

### Controllers/
- `userController.js` - Logique des utilisateurs
- `carController.js` - Logique des voitures
- `osController.js` - Logique des ordres de service

### Models/
- `userModel.js` - Schéma utilisateur
- `carModel.js` - Schéma voiture

### Routes/
- `index.js` - Routes principales
- `userRouter.js` - Routes utilisateurs
- `carRouter.js` - Routes voitures
- `osRouter.js` - Routes ordres de service

### Services/
- `carService.js` - Logique métier des voitures
- `osService.js` - Logique métier des ordres de service

## 🧪 Tests et Qualité

### Bonnes Pratiques
- **Code modulaire** et réutilisable
- **Gestion d'erreurs** robuste
- **Validation des données** stricte
- **Documentation** complète
- **Structure cohérente** entre modules

### Standards de Code
- **ES6+** syntax
- **Async/await** pour les opérations asynchrones
- **Try/catch** pour la gestion d'erreurs
- **Noms explicites** pour les variables et fonctions

## 🌐 Déploiement

### Variables d'Environnement de Production
```env
NODE_ENV=production
Port=3000
Url_Db=mongodb://production-url:27017/pfesousse
```

### Process Manager (PM2)
```bash
npm install -g pm2
pm2 start app.js --name "pfesousse"
pm2 save
pm2 startup
```

## 📚 Ressources et Documentation

- **MongoDB** : [Documentation officielle](https://docs.mongodb.com/)
- **Mongoose** : [Documentation officielle](https://mongoosejs.com/)
- **Express.js** : [Documentation officielle](https://expressjs.com/)
- **Node.js** : [Documentation officielle](https://nodejs.org/)

## 🤝 Contribution

### Comment Contribuer
1. **Fork** le projet
2. **Créer** une branche pour votre fonctionnalité
3. **Commiter** vos changements
4. **Pousser** vers la branche
5. **Ouvrir** une Pull Request

### Standards de Contribution
- **Code propre** et bien documenté
- **Tests** pour les nouvelles fonctionnalités
- **Documentation** mise à jour
- **Messages de commit** explicites

## 📄 Licence

Ce projet est sous licence privée. Tous droits réservés.

## 👥 Auteurs

- **Équipe PFESousse** - Développement et maintenance

## 📞 Support

Pour toute question ou support :
- **Issues GitHub** : Créer une issue dans le repository
- **Documentation** : Consulter les fichiers de documentation
- **Code source** : Examiner les exemples dans les contrôleurs

---

## 🎯 Roadmap

### Version 2.1.0
- [ ] Authentification JWT
- [ ] API de notifications
- [ ] Système de logs avancé

### Version 2.2.0
- [ ] Interface d'administration
- [ ] Rapports et analytics
- [ ] Intégration SMS/Email

### Version 3.0.0
- [ ] Microservices architecture
- [ ] Cache Redis
- [ ] API GraphQL

---

**PFESousse** - Une solution complète pour la gestion automobile moderne ! 🚗✨
