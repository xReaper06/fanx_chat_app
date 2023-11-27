const express = require('express');
const Router = express.Router();
const TokenValidity = require('../middleware/tokenValidity')
const userController = require('../controllers/userController');

Router.post('/getRoom',TokenValidity.verifyToken,userController.getRooms);
Router.post('/getRoomConvo',TokenValidity.verifyToken,userController.getRoomConvo);
Router.post('/create-room',TokenValidity.verifyToken,userController.storeRoom);
Router.post('/getMyRoom',TokenValidity.verifyToken,userController.getMyRoom);
Router.get('/getAllUsers',TokenValidity.verifyToken,userController.getAllUsers);
Router.get('/getAllRooms',TokenValidity.verifyToken,userController.getAllRooms);



module.exports = Router