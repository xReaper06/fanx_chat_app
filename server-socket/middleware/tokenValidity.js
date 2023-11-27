require('dotenv').config();

const jwt = require('jsonwebtoken');
const jwtSecret = process.env.ACCESS_TOKEN;

// Middleware for verifying JWT tokens
function verifyToken(req, res, next) {
  let authHeaders = req.headers['authorization']; // Use lowercase 'authorization'
  let token = authHeaders && authHeaders.split(' ')[1]
  if (token==null) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
      req.user = user; // Attach user information to the request
      next();
    
  });
}

module.exports = {
  verifyToken
};
