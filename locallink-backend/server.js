require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { connectDB } = require('./db');

const app = express();

// Middleware
const { checkJwt, authorizeRoles } = require('./middleware/auth');

// Routers
const adminRouter = require('./routes/admin');
const profileRouter = require('./routes/profile');
const serviceRouter = require('./routes/service');

// Debug env variables
console.log('ASGARDEO_ORG:', process.env.ASGARDEO_ORG);
console.log('ASGARDEO_CLIENT_ID:', process.env.ASGARDEO_CLIENT_ID);

// CORS setup
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());

// Connect to MongoDB before starting the server
connectDB()
  .then(() => {
    // Attach DB instance to app.locals for easy access in routes
    const { getDB } = require('./db');
    app.locals.db = getDB();

    // Use routers
    app.use('/api/services', serviceRouter);
    app.use('/api/admin', adminRouter);
    app.use('/api', profileRouter);

    // Remove dummy /api/services route — serviceRouter handles that now

    // Default route
    app.get('/', (req, res) => {
      res.send('🚀 LocalLink Backend is Running');
    });

    // Start server
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 LocalLink backend running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  });
