require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');

const app = express();

const { checkJwt, authorizeRoles } = require('./middleware/auth');

const adminRouter = require('./routes/admin');
const profileRouter = require('./routes/profile');
const serviceRouter = require('./routes/service');

console.log('ASGARDEO_ORG:', process.env.ASGARDEO_ORG);
console.log('ASGARDEO_CLIENT_ID:', process.env.ASGARDEO_CLIENT_ID);

app.use(
  cors({
    origin: 'http://localhost:5173', // Your frontend origin
    credentials: true,
  })
);

app.use(express.json());

connectDB()
  .then(() => {
    const { getDB } = require('./db');
    app.locals.db = getDB();

    app.use('/api/services', serviceRouter);
    app.use('/api/admin', adminRouter);
    app.use('/api', profileRouter); // mount profile router under /api

    app.get('/', (req, res) => {
      res.send('🚀 LocalLink Backend is Running');
    });

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 LocalLink backend running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  });
