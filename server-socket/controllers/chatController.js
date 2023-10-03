const socketIo = require('socket.io');
const mysql = require('mysql2/promise');
const multer = require('multer');
const dbConfig = require('./dbConfig'); // Import your database configuration
const fetchChatMessages = require('./fetchChatMessages'); // Import your chat message fetching function

const initializeSocketIO = (server) => {
  const io = socketIo(server);

  // Configure multer for file uploads
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, '../server-socket/public/uploads'); // Adjust the destination folder
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });

  const upload = multer({ storage });

  io.on('connection', async (socket) => {
    console.log('A user connected to chat');

    // Define the createChatMessage function
    const createChatMessage = async (roomId, senderId, message, filePath) => {
      try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
          'INSERT INTO chat_messages (room_id, sender_id, message, file_path) VALUES (?, ?, ?, ?)',
          [roomId, senderId, message, filePath]
        );

        // Close the database connection
        await connection.end();

        console.log(`Message saved to the database with ID: ${result.senderId}`);
        return result;
      } catch (error) {
        console.error('Error saving message to the database:', error);
        throw error;
      }
    };

    // Listen for chat messages in the chat controller
    socket.on('joinRoom', (room) => {
      // Join the specific room when requested
      socket.join(room);

      // Fetch chat messages for this room from the database
      fetchChatMessages(room)
        .then((messages) => {
          // Send the chat history to the user who joined
          socket.emit('chat history', messages);
        })
        .catch((error) => {
          console.error('Error fetching chat messages:', error);
        });
    });

    // Handle file uploads and messages
    socket.on('chat message', async (data) => {
      const { room, message, file } = data;

      // Handle file upload (if a file is attached)
      let filePath = '';
      if (file) {
        // Implement the uploadFile function to handle file uploads and return the file path
        const uploadResult = await uploadFile(file);
        filePath = uploadResult.filePath;
      }

      // Assume that you have a user object with the sender's information
      const senderId = user.id; // Adjust this to access the sender's ID

      // Call the createChatMessage function to save the message to the database
      try {
        const result = await createChatMessage(room, senderId, message, filePath);

        // Emit the message to everyone in the room
        io.to(room).emit('chat message', {
          sender: user.username, // Make sure 'user' is properly initialized
          message,
          file: filePath, // Send the file path or URL
        });
      } catch (error) {
        console.error('Error saving message to the database:', error);
      }
    });

    // Handle disconnections in the chat controller
    socket.on('disconnect', () => {
      console.log('A user disconnected from chat');
    });
  });
};

module.exports = initializeSocketIO;
