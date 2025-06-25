require('dotenv').config();
console.log("ASGARDEO_ORG:", process.env.ASGARDEO_ORG);
console.log("ASGARDEO_CLIENT_ID:", process.env.ASGARDEO_CLIENT_ID);


const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const axios = require('axios');

const app = express();

// Import routes
const userRoutes = require('./routes/user');
const checkRoleRoutes = require('./routes/checkRole');

// CORS setup to allow React frontend
app.use(
  cors({
    origin: 'http://localhost:5173', // React app URL
    credentials: true,
  })
);

app.use(express.json());

// Mount routes with distinct prefixes
app.use('/api/user', userRoutes);
app.use('/api/checkrole', checkRoleRoutes);

// In-memory data stores
let services = [];
let idCounter = 1;
let userProfiles = {}; // Store user profiles

// Hardcoded users (Admins only)
const users = [
  { id: 'user1', email: 'alice@example.com', role: 'customer' },
  { id: 'user2', email: 'bob@example.com', role: 'service_provider' },
  { id: 'admin1', email: 'admin@example.com', role: 'admin' },
];

// JWT Auth setup with JWKS
const client = jwksClient({
  jwksUri: `https://api.asgardeo.io/t/${process.env.ASGARDEO_ORG}/oauth2/jwks`,
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      console.error('❌ Error getting signing key:', err);
      return callback(err);
    }
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
      if (err) {
        console.error('❌ JWT validation failed:', err);
        return res.sendStatus(403);
      }
      console.log('✅ Decoded JWT:', user);
      req.user = user;
      next();
    }
  );
}

// ---------------- API Routes ----------------

// GET all services - any authenticated user
app.get('/api/services', authenticateToken, (req, res) => {
  res.json(services);
});

// POST create new service - only service providers
app.post('/api/services', authenticateToken, (req, res) => {
  const roles = req.user.roles;

  const isServiceProvider = Array.isArray(roles)
    ? roles.includes('service_provider')
    : typeof roles === 'string' &&
      roles.split(',').map((r) => r.trim()).includes('service_provider');

  if (!isServiceProvider) {
    return res.status(403).json({ message: 'Forbidden: Not a service provider' });
  }

  const { title, description } = req.body;
  const newService = {
    id: idCounter++,
    title,
    description,
    provider_user_id: req.user.sub,
  };
  services.push(newService);
  res.status(201).json(newService);
});

// PUT update own service - only owner can update
app.put('/api/services/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const service = services.find((s) => s.id === id);

  if (!service) return res.status(404).json({ message: 'Not found' });

  if (service.provider_user_id !== req.user.sub) {
    return res.status(403).json({ message: 'Forbidden: Not your service' });
  }

  service.title = req.body.title || service.title;
  service.description = req.body.description || service.description;
  res.json(service);
});

// POST /api/profile - Save or update profile
app.post('/api/profile', authenticateToken, (req, res) => {
  const { role, contactNumber, bio } = req.body;
  const userEmail = req.user.sub;

  if (!role) {
    return res.status(400).json({ message: 'Role is required' });
  }

  userProfiles[userEmail] = {
    email: userEmail,
    role,
    contactNumber: contactNumber || '',
    bio: bio || '',
  };

  console.log(`✅ Profile saved for ${userEmail}:`, userProfiles[userEmail]);

  return res.json({ message: 'Profile saved successfully' });
});

// GET /api/profile - Get current user profile
app.get('/api/profile', authenticateToken, (req, res) => {
  const userEmail = req.user.sub;
  const profile = userProfiles[userEmail];

  if (!profile) {
    return res.status(404).json({ message: 'Profile not found' });
  }

  return res.json(profile);
});

// GET all users - Admin only
app.get('/api/users', authenticateToken, (req, res) => {
  const roles = req.user.roles;

  const isAdmin = Array.isArray(roles)
    ? roles.includes('admin')
    : typeof roles === 'string' &&
      roles.split(',').map((r) => r.trim()).includes('admin');

  if (!isAdmin) {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }

  res.json(users);
});

// Default route
app.get('/', (req, res) => {
  res.send('LocalLink Backend is Running');
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 LocalLink backend running on port ${PORT}`);
});
