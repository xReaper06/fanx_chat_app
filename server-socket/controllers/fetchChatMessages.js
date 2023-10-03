const mysql = require('mysql2/promise');
const dbConfig = require('./dbConfig'); // Import your database configuration

async function fetchChatMessages(roomId) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      'SELECT * FROM chat_messages WHERE room_id = ? ORDER BY created_at ASC',
      [roomId]
    );

    // Close the database connection
    await connection.end();

    // Return the fetched chat messages
    return rows;
  } catch (error) {
    console.error('Error fetching chat messages from the database:', error);
    throw error;
  }
}

module.exports = fetchChatMessages;
