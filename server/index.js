import express from 'express';
import path from 'path';
import cors from 'cors';
import cron from 'node-cron';
import { fileURLToPath } from 'url';

import { initializeDatabase } from './services/database.js';
import { setupProductRoutes } from './routes/productRoutes.js';
import { updateAllProductPrices } from './services/priceService.js';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, '..', 'dist');

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
setupProductRoutes(app);

// Serve frontend
app.use(express.static(frontendPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Cron job
cron.schedule('*/30 * * * *', async () => {
  console.log('Running scheduled price update every 30 mins...');
  try {
    await updateAllProductPrices();
  } catch (err) {
    console.error('Error updating prices:', err);
  }
});

app.listen(PORT, () => {
  initializeDatabase(); // optional: init DB
  console.log(`Server running on port ${PORT}`);
});
