
var express = require('express');
var router = express.Router();
/* GET users listing. */
const userController = require("../Controllers/userController")

const uploadfile = require("../middlewares/uploadFile")

router.get('/getAllUsers', userController.getAllUsers);
router.get('/getAllUsersSortedByFirstName', userController.getAllUsersSortedByFirstName);
router.get('/searchUsersByFirstName', userController.searchUsersByFirstName);
router.get('/getUserById/:id', userController.getUserById);
router.get('/getUserByAge/:age', userController.getUserByAge);
router.get('/getUserBetweenAgeXAndY', userController.getUserBetweenAgeXAndY);
router.post('/addClient', userController.addClient);
router.post('/addClientV2', userController.addClientV2);
router.post('/addClientWithImage',uploadfile.single("user_Image"), userController.addClientWithImage);
router.delete('/deleteUserById/:id', userController.deleteUserById);

module.exports = router;
