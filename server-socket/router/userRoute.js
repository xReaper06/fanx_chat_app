const express = require('express')
const router = express.Router();
const { createChatMessage,fetchChatMessages } = require('../controllers/chatController');
  const TokenValidity = require('../middleware/tokenValidity')

  router.post('/chat/messages',TokenValidity.verifyToken, async (req, res) => {
    const { roomId, senderId, message } = req.body; // Assuming you send these parameters in the request body
  
    try {
      const newMessage = await createChatMessage(roomId, senderId, message);
      res.status(201).json(newMessage);
    } catch (error) {
      console.error('Error posting chat message:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/chat/:roomId/messages',TokenValidity.verifyToken, async (req, res) => {
    const { roomId } = req.params;
  
    try {
      const messages = await fetchChatMessages(roomId);
      res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  module.exports = router;
  