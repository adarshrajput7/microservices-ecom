import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

mongoose.set('overwriteModels', true);

// --- 1. Import Database Connections ---
import connectAuthDB from './backend-services/auth/src/db/db.js';
import connectCartDB from './backend-services/cart/src/db/db.js';
import connectOrderDB from './backend-services/order/src/db/db.js';
import connectPaymentDB from './backend-services/payment/src/db/db.js';
import connectProductDB from './backend-services/product/src/db/db.js';
import connectSellerDB from './backend-services/seller-dashboard/src/db/db.js';

// --- 2. Safe Database Initialization ---
const initDatabases = async () => {
  const connections = [
    { name: 'Auth', fn: connectAuthDB },
    { name: 'Cart', fn: connectCartDB },
    { name: 'Order', fn: connectOrderDB },
    { name: 'Payment', fn: connectPaymentDB },
    { name: 'Product', fn: connectProductDB },
    { name: 'Seller', fn: connectSellerDB },
  ];

  for (const db of connections) {
    if (typeof db.fn === 'function') {
      try {
        await db.fn();
      } catch (err) {
        console.error(`⚠️ ${db.name} DB connection failed:`, err.message);
      }
    }
  }
};

initDatabases();

// --- 3. Import Service Routes ---
import authRoutes from './backend-services/auth/src/routes/auth.routes.js';
import cartRoutes from './backend-services/cart/src/routes/cart.route.js';
import notificationApp from './backend-services/notification/src/app.js';
import orderRoutes from './backend-services/order/src/routes/order.routes.js';
import paymentRoutes from './backend-services/payment/src/routes/payment.routes.js';
import productRoutes from './backend-services/product/src/routes/product.routes.js';
import sellerRoutes from './backend-services/seller-dashboard/src/routes/seller.routes.js';

const app = express();

// --- 4. Fixed Safe CORS Setup ---
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://microservices-ecom-six.vercel.app',
  'https://microservices-ecom-h2ok8m9bc-adarsh-6a50.vercel.app',
  process.env.USER_FRONTEND_URL,
  process.env.SELLER_FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Non-browser or Allowed origins or Vercel preview deployments
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    // NEVER throw new Error() inside CORS callback — pass false instead
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(cookieParser());

// --- 5. Ping Endpoint ---
app.get('/ping', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API Gateway running successfully!' });
});

// --- 6. Register Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/notification', notificationApp);
app.use('/api/order', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/product', productRoutes);
app.use('/api/seller', sellerRoutes);

// --- 7. Global Error Handler (Prevents Server Crash) ---
app.use((err, req, res, next) => {
  console.error('Unhandled Gateway Error:', err.message);
  res.status(500).json({ error: err.message || 'Internal Gateway Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});