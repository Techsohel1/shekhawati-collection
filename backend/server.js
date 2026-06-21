import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

// Route imports
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import utilsRoutes from './routes/utils.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend integration
app.use(cors({
  origin: '*', // Allow all origins for local running/testing ease
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Initialize Database connection (Selects MongoDB vs Local JSON automatically)
connectDB();

// API Routes mounting
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/utils', utilsRoutes);

// Base Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Shekhawati Collection Premium E-Commerce API Server',
    status: 'Running',
    documentation: 'See frontend integrations for available endpoints.'
  });
});

// Start Server
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`Server is running in development mode on port ${PORT}`);
    console.log(`API Local Address: http://localhost:${PORT}`);
    console.log(`===================================================`);
  });
}

export default app;
