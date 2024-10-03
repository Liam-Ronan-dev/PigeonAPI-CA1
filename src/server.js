import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello world');
});

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port: http://localhost:${process.env.PORT}`);
});
