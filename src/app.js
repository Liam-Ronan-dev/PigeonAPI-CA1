import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { createUser, singIn } from './controllers/user.js';
import { connectDB } from './config/db.js';
import pigeonRoutes from './routes/pigeon.js';
import MedicalTreatmentRoutes from './routes/medicalTreatment.js';
import raceHistory from './routes/raceHistory.js';
import morgan from 'morgan';

const app = express();

dotenv.config();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'testing') {
  connectDB();
}

app.get('/', (req, res) => {
  res.json({ message: 'hello world' });
});

app.use('/api', pigeonRoutes);
app.use('/api', MedicalTreatmentRoutes);
app.use('/api', raceHistory);

app.post('/user', createUser);
app.post('/signin', singIn);

export default app;
