import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import volunteerRoutes from './routes/volunteerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

dotenv.config();

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || '*',
        methods: ['GET', 'POST']
    }
});

// Security & Logging Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// Body parser
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Socket.io injection middleware
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/complaints', complaintRoutes);
import uploadRoutes from './routes/uploadRoutes.js';
app.use('/api/upload', uploadRoutes);

import path from 'path';
const __dirname = path.resolve();

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'FlashFood API is running smoothly' });
});

if (process.env.NODE_ENV === 'production') {
    // Serve frontend
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
    });
} else {
    // Fallback for local development
    app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
    app.get('/', (req, res) => {
        res.send('FlashFood API is running in Development...');
    });
}

// Global Error Handlers
app.use(notFound);
app.use(errorHandler);

// Socket.io Connection
io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
