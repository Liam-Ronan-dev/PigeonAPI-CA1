import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { createUser, singIn } from './controllers/user.js';
import { connectDB } from './config/db.js';
import pigeonRoutes from './routes/pigeon.js';
import MedicalTreatmentRoutes from './routes/medicalTreatment.js';
import raceHistory from './routes/raceHistory.js';
import morgan from 'morgan';
import { errorHandler } from './modules/middleware.js';

const app = express();

dotenv.config();

// Enhanced CORS configuration
const corsOptions = {
  origin: '*', // Allow all origins (update with specific domain if necessary)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};
app.use(cors(corsOptions));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'testing') {
  connectDB();
}

app.get('/', (req, res) => {
  res.json({ message: 'hello world' });
});

app.get('/error', (req, res, next) => {
  const error = new Error('This is a test error!');
  error.status = 500;
  next(error);
});

app.use('/api', pigeonRoutes);
app.use('/api', MedicalTreatmentRoutes);
app.use('/api', raceHistory);

app.post('/user', createUser);
app.post('/signin', singIn);

app.use(errorHandler);

export default app;
