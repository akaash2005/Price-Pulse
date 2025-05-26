import express from 'express';
import cors from 'cors';
import path from 'path';
import cron from 'node-cron';
import { fileURLToPath } from 'url';


import {setupProductRoutes}  from './routes/productRoutes.js';
import { updateAllProductPrices } from './services/priceService.js';

import { initializeDatabase, /*deleteProductsWithLongUrls*/ } from './database.js';

initializeDatabase();
/*deleteProductsWithLongUrls();*/ // <--- THIS RUNS THE CLEANUP


const app = express();
const PORT = process.env.PORT || 8080;

// Handle __dirname with ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize database
initializeDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
setupProductRoutes(app);

// Static files (React frontend)
app.use(express.static(path.join(__dirname, '../dist')));

// React Router fallback (for SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Cron job: run every 30 minutes
app.get('/api/cron/trigger', async (req, res) => {
  try {
    console.log('🔁 External cron triggered price update...');
    await updateAllProductPrices();
    res.status(200).send('✅ Price update completed via cron.');
  } catch (err) {
    console.error('❌ Cron-triggered update failed:', err);
    res.status(500).send('Error updating prices via cron.');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
