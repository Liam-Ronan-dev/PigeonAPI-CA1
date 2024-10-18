import express from 'express';
const router = express.Router();

import {
  createPigeon,
  deletePigeon,
  getAllPigeons,
  getSinglePigeon,
  updatePigeon,
} from '../controllers/pigeon.js';

import { protect } from '../modules/auth.js';
import { handleInputErrors } from '../modules/middleware.js';
// import upload from '../middleware/upload.js'; // Multer configuration

// Protected Routes
router.post('/pigeon', protect, handleInputErrors, createPigeon);
router.put('/pigeon/:id', protect, updatePigeon);
router.delete('/pigeon/:id', protect, deletePigeon);

// Public Route)
router.get('/pigeons', getAllPigeons);
router.get('/pigeon/:id', getSinglePigeon);

export default router;
