const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// MongoDB connection setup
const url = process.env.MONGO_URL || "mongodb://admin:password@172.31.27.251:27017/admin?authSource=admin";
console.log("Using MONGO_URL:", url);

const client = new MongoClient(url);
let db;

client.connect()
  .then(() => {
    db = client.db('AccountDetails');
    console.log('✅ Connected to MongoDB');
  })
  .catch(err => {
    console.error('❌ Error connecting to MongoDB:', err);
    process.exit(1); // Optional: crash container if DB is unreachable
  });

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post('/submit', async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  if (!db) {
    return res.status(500).json({ message: 'Database not connected' });
  }

  try {
    const result = await db.collection('users').insertOne({ name, email });
    res.json({ message: 'Data submitted successfully', id: result.insertedId });
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ message: 'Error submitting data' });
  }
});

// Fetch data
app.get('/data', async (req, res) => {
  if (!db) {
    return res.status(500).send('Database not connected');
  }

  try {
    const data = await db.collection('users').find().toArray();
    res.json(data);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send('Error fetching data');
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
