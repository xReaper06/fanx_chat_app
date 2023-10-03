const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

// Middleware for verifying JWT tokens
function verifyToken(req, res, next) {
  const token = req.headers.authorization; // Use lowercase 'authorization'

  if (!token) {
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
