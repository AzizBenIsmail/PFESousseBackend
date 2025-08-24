var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json('index');
});

// Import des routes
const userRouter = require('./userRouter');
const carRouter = require('./carRouter');
const osRouter = require('./osRouter');

// Utilisation des routes
router.use('/users', userRouter);
router.use('/cars', carRouter);
router.use('/os', osRouter);

module.exports = router;
