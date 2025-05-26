import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import { initializeDatabase } from './database.js';
import productRoutes from './routes/productRoutes.js';
import { updateAllProductPrices } from './services/priceService.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Init DB
initializeDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Mount the API route at /api/products
app.use('/api/products', productRoutes);

// ⏰ Scraper every 30 minutes (or change to */1 * * * * for 1 min testing)
cron.schedule('*/30 * * * *', async () => {
  console.log('⏰ Running scheduled price update...');
  try {
    await updateAllProductPrices();
    console.log('✅ Price update complete');
  } catch (error) {
    console.error('❌ Error updating prices:', error);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
