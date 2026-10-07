// import express from 'express';
// import cookieParser from 'cookie-parser';
// import cors from 'cors';
// import dotenv from 'dotenv';

// dotenv.config();

// // 1. Import Service Routes (Aapke backend-services folder paths ke hisaab se)
// import authRoutes from './backend-services/auth/src/routes/auth.routes.js';
// import cartRoutes from './backend-services/cart/src/routes/cart.route.js';
// import notificationRoutes from './backend-services/notification/src/broker/listners.js';
// import orderRoutes from './backend-services/order/src/routes/order.routes.js';
// import paymentRoutes from './backend-services/payment/src/routes/payment.routes.js';
// import productRoutes from './backend-services/product/src/routes/product.routes.js';
// import sellerRoutes from './backend-services/seller-dashboard/src/routes/seller.routes.js';

// const app = express();

// // 2. Dynamic CORS Setup
// const allowedOrigins = [
//   'http://localhost:5173',                   // User Frontend Local
//   'http://localhost:5174',                   // Seller Frontend Local
//   process.env.USER_FRONTEND_URL,             // Vercel User App URL
//   process.env.SELLER_FRONTEND_URL            // Vercel Seller App URL
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('CORS Policy Restriction'));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// app.use(express.json());
// app.use(cookieParser());

// // 3. Keep-Alive Ping (For Koyeb / Render Anti-Sleep)
// app.get('/ping', (req, res) => {
//   res.status(200).json({ status: 'ok', message: 'API Gateway running successfully!' });
// });

// // 4. Register Services API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/notification', notificationRoutes);
// app.use('/api/order', orderRoutes);
// app.use('/api/payment', paymentRoutes);
// app.use('/api/product', productRoutes);
// app.use('/api/seller', sellerRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`API Gateway running on port ${PORT}`);
// });




import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// --- 1. Import Database Connections ---
import connectAuthDB from './backend-services/auth/src/db/db.js';
import connectCartDB from './backend-services/cart/src/db/db.js';
import connectOrderDB from './backend-services/order/src/db/db.js';
import connectPaymentDB from './backend-services/payment/src/db/db.js';
import connectProductDB from './backend-services/product/src/db/db.js';
import connectSellerDB from './backend-services/seller-dashboard/src/db/db.js';
// import connect from './backend-services/notification/src/broker/broker.js';
// import listener from './backend-services/notification/src/broker/listners.js';


// --- 2. Initialize Database Connections ---
const initDatabases = async () => {
  try {
    if (connectAuthDB) await connectAuthDB();
    if (connectCartDB) await connectCartDB();
    if (connectOrderDB) await connectOrderDB();
    if (connectPaymentDB) await connectPaymentDB();
    if (connectProductDB) await connectProductDB();
    if (connectSellerDB) await connectSellerDB();
  } catch (err) {
    console.error('Database connection error:', err.message);
  }
};

initDatabases();

// const startServer = async () => {
//   try {
//     // Envelope load hone ke BAAD ye chalega
//     // await connect.connect();
//     // listener();
//     await connect.connect().then(() => {
//       listener()
//     })
//     console.log("Notification Broker & Listeners initialized successfully!");
//   } catch (error) {
//     console.error("Broker connection failed:", error.message);
//   }
// }

const startServer = async () => {
  try {
    // 1. Properly wait for RabbitMQ connection
    await connect.connect();
    console.log("RabbitMQ Connected!");

    // 2. Attach listeners AFTER connection is confirmed
    listener();
    console.log("Notification Broker & Listeners initialized successfully!");

  } catch (error) {
    console.error("Broker connection failed:", error.message);
  }
};

// --- 3. Import Service Routes ---
import authRoutes from './backend-services/auth/src/routes/auth.routes.js';
import cartRoutes from './backend-services/cart/src/routes/cart.route.js';
import notificationApp from './backend-services/notification/src/app.js';
// import notificationRoutes from './backend-services/notification/src/broker/listners.js';
import orderRoutes from './backend-services/order/src/routes/order.routes.js';
import paymentRoutes from './backend-services/payment/src/routes/payment.routes.js';
import productRoutes from './backend-services/product/src/routes/product.routes.js';
import sellerRoutes from './backend-services/seller-dashboard/src/routes/seller.routes.js';

const app = express();

// --- 4. Dynamic CORS Setup ---
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.USER_FRONTEND_URL,
  process.env.SELLER_FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS Policy Restriction'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});

// startServer()