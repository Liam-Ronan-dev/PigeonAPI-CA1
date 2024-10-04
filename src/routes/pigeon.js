import express from 'express';
const router = express.Router();

import {
  createPigeon,
  deletePigeon,
  getAllPigeons,
  getSinglePigeon,
} from '../controllers/pigeon.controller.js';

import { protect } from '../modules/auth.js';
// import upload from '../middleware/upload.js'; // Multer configuration

// Create a new pigeon (protected route)
router.post('/pigeon', protect, createPigeon);
router.delete('/pigeon/:id', protect, deletePigeon);

// Get all pigeons (public route)
router.get('/pigeons', getAllPigeons);
router.get('/pigeon/:id', getSinglePigeon);

export default router;
