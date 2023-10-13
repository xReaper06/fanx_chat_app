const db = require('./config/dbConnection.js'); // Import your database configuration

async function fetchChatMessages(roomId) {
  let conn;
  try {
    conn = await db.getConnection()
    const [rows] = await conn.execute(
      'SELECT * FROM chat_messages WHERE room_id = ? ORDER BY created_at ASC',
      [roomId]
    );

    // Close the database connection
    await conn.end();

    // Return the fetched chat messages
    return rows;
  } catch (error) {
    console.error('Error fetching chat messages from the database:', error);
    throw error;
  }
}

module.exports = fetchChatMessages;
