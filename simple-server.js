import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import http from 'http';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Start a simple Express server
const app = express();
const PORT = 5000;

// Enable CORS for all origins
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Serve static files directly
app.use(express.static('.'));

// Serve index.html for the root path
app.get('/', async (req, res) => {
  try {
    // Try to read the index.html file directly
    const indexPath = join(__dirname, 'index.html');
    const content = await fs.readFile(indexPath, 'utf-8');
    res.setHeader('Content-Type', 'text/html');
    res.send(content);
  } catch (err) {
    console.error('Error reading index.html:', err);
    res.status(500).send('Error loading the application');
  }
});

// Specify exact routes instead of using wildcards
app.get('/about', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.get('/settings', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Shadow OS server is running on port ${PORT}`);
  console.log(`Main application is available at http://localhost:${PORT}`);
});