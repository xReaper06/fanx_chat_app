const express = require('express')
const router = express.Router();
const { createChatMessage,fetchChatMessages } = require('../controllers/chatController');
  const TokenValidity = require('../middleware/tokenValidity');
  module.exports = router;
  