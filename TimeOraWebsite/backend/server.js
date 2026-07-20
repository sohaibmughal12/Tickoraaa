import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './src/config/db.js';
import { notFound, errorHandler } from './src/middlewares/errorMiddleware.js';

// Route Imports
import authRoutes from './src/routes/authRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import categoryRoutes from './src/routes/categoryRoutes.js';
import couponRoutes from './src/routes/couponRoutes.js';
import reviewRoutes from './src/routes/reviewRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import { generateSitemapXml } from './src/utils/sitemap.js';

// Configuration Setup
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();

// Security Middlewares
app.use(helmet());
const allowedOrigins = [
  "http://localhost:5173",
  "https://tickoraaa-nine.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
// Logger Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get("/", (req, res) => {
  res.send("Tickora Backend is Running 🚀");
});
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Tickora luxury API server running smoothly.' });
});

// Auth Routes registration
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);

// Dynamic XML sitemap for search crawlers
app.get('/sitemap.xml', async (req, res) => {
  try {
    const sitemap = await generateSitemapXml();
    res.setHeader('Content-Type', 'application/xml');
    return res.status(200).send(sitemap);
  } catch (error) {
    return res.status(500).end();
  }
});

// Fallback Routes for Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Tickora Luxury MERN Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
