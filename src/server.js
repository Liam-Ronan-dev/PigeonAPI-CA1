import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { createUser, singIn } from './controllers/user.js';
import pigeonRoutes from './routes/pigeon.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'hello world' });
});

app.use('/api', pigeonRoutes);
app.post('/user', createUser);
app.post('/signin', singIn);

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port: http://localhost:${process.env.PORT}`);
});
