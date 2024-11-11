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
import {
  createPigeonValidator,
  deletePigeonValidator,
  getPigeonByIdValidator,
  updatePigeonValidator,
} from '../validators/pigeonValidator.js';
import { imageUpload } from '../modules/imageUpload.js';
// import upload from '../middleware/upload.js'; // Multer configuration

// Protected Routes
router.post(
  '/pigeon',
  protect,
  createPigeonValidator,
  handleInputErrors,
  imageUpload.single('imageUrl'),
  createPigeon
);

router.put(
  '/pigeon/:id',
  protect,
  updatePigeonValidator,
  handleInputErrors,
  imageUpload.single('imageUrl'),
  updatePigeon
);

router.delete(
  '/pigeon/:id',
  protect,
  deletePigeonValidator,
  handleInputErrors,
  deletePigeon
);

// Public Route
router.get('/pigeons', getAllPigeons);
router.get(
  '/pigeon/:id',
  getPigeonByIdValidator,
  handleInputErrors,
  getSinglePigeon
);

export default router;
