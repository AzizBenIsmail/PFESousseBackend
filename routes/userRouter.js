
var express = require('express');
var router = express.Router();
/* GET users listing. */
const userController = require("../Controllers/userController")
const {requireAuthUser} = require("../middlewares/authmiddlewares")

const uploadfile = require("../middlewares/uploadFile")

router.get('/getAllUsers', requireAuthUser,userController.getAllUsers);
router.get('/getAllUsersSortedByFirstName',requireAuthUser, userController.getAllUsersSortedByFirstName);
router.get('/searchUsersByFirstName',requireAuthUser, userController.searchUsersByFirstName);
router.get('/getUserById/:id',requireAuthUser, userController.getUserById);
router.get('/getUserByAge/:age',requireAuthUser, userController.getUserByAge);
router.get('/getUserBetweenAgeXAndY',requireAuthUser, userController.getUserBetweenAgeXAndY);
router.post('/addClient', userController.addClient);
router.post('/addClientV2', userController.addClientV2);
router.post('/login', userController.login);
router.post('/logout',requireAuthUser, userController.logout);
router.post('/addClientWithImage',uploadfile.single("user_Image"), userController.addClientWithImage);
router.delete('/deleteUserById/:id',requireAuthUser, userController.deleteUserById);

module.exports = router;
