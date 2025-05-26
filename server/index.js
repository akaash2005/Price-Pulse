import express from 'express';
import cors from 'cors';
import path from 'path';
import cron from 'node-cron';
import { fileURLToPath } from 'url';

import { initializeDatabase } from './database.js';
import {setupProductRoutes}  from './routes/productRoutes.js';
import { updateAllProductPrices } from './services/priceService.js';

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
cron.schedule('*/1 * * * *', async () => {
  console.log('Running scheduled price update every 30 minutes...');
  try {
    await updateAllProductPrices();
    console.log('Price update completed successfully');
  } catch (error) {
    console.error('Error updating prices:', error);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
