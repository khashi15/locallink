const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../asgardeoClient'); // Adjust path if needed

// Middleware to authenticate JWT (reuse the one from server.js or copy here)
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
require('dotenv').config();

const jwks = jwksClient({
  jwksUri: `https://api.asgardeo.io/t/${process.env.ASGARDEO_ORG}/oauth2/jwks`,
});

function getKey(header, callback) {
  jwks.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];
  jwt.verify(
    token,
    getKey,
    {
      algorithms: ['RS256'],
      audience: process.env.ASGARDEO_CLIENT_ID,
      issuer: `https://api.asgardeo.io/t/${process.env.ASGARDEO_ORG}/oauth2/token`,
    },
    (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    }
  );
}

// GET /api/asgardeo/users
router.get('/users', authenticateToken, async (req, res) => {
  const roles = req.user.roles;

  const isAdmin = Array.isArray(roles)
    ? roles.includes('admin')
    : typeof roles === 'string' && roles.split(',').map(r => r.trim()).includes('admin');

  if (!isAdmin) {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }

  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('❌ Error fetching users from Asgardeo:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
