const express = require('express');
const authRouter = express.Router();
const path = require('path')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../server/public/images'); // Adjust the destination folder as needed
    },
    filename: function (req, file, cb) {
      cb(null,file.originalname);
    },
  });
  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/png'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

  const upload = multer({ storage: storage, fileFilter: fileFilter });

const {
    signUpValidation,
    loginValidation,
    idValidation,
   } = require('../helpers/validator')
const authController = require('../controllers/authController');

authRouter.post('/userRegistration',upload.single('profilePicture'), signUpValidation, authController.userRegistration);
authRouter.post('/login', loginValidation, authController.login);
authRouter.post('/refresh-token', authController.Token);
authRouter.post('/logout/:id', idValidation, authController.logout);

module.exports = authRouter;