require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();

const { checkJwt, authorizeRoles } = require('./middleware/auth');
const adminRouter = require('./routes/admin');

console.log('ASGARDEO_ORG:', process.env.ASGARDEO_ORG);
console.log('ASGARDEO_CLIENT_ID:', process.env.ASGARDEO_CLIENT_ID);

// ------------------ CORS ------------------
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

// ------------------ MongoDB ------------------
const mongoUri = process.env.MONGODB_URI;
const client = new MongoClient(mongoUri);

async function connectToMongo() {
  try {
    await client.connect();
    const db = client.db('locallink');
    app.locals.db = db;
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
}

// ------------------ Routes ------------------
app.use('/api/admin', adminRouter);

// ✅ Dummy services endpoint (replace with DB later)
app.get('/api/services', checkJwt, (req, res) => {
  res.json([
    {
      id: '1',
      title: 'Web Design',
      description: 'Professional web design services.',
    },
    {
      id: '2',
      title: 'Home Cleaning',
      description: 'Expert home cleaning service.',
    },
    {
      id: '3',
      title: 'Plumbing',
      description: 'Reliable plumbing services.',
    },
  ]);
});

// Default
app.get('/', (req, res) => {
  res.send('🚀 LocalLink Backend is Running');
});

// ------------------ Start ------------------
const PORT = process.env.PORT || 3001;

connectToMongo().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 LocalLink backend running at http://localhost:${PORT}`);
  });
});
