import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import cartRoutes from './routes/cartRoutes';
import adminRoutes from './routes/adminRoutes';
import checkoutRoutes from './routes/checkoutRoutes';

import { connectDatabase } from './config/database';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'E-commerce API is running' });
});

app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

