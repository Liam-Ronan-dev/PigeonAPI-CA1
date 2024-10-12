import express from 'express';
const router = express.Router();

import {
  createMedicalTreatment,
  deleteMedicalTreatment,
  getAllMedicalTreatments,
  getSingleMedicalTreatment,
} from '../controllers/medicalTreatment.js';

import { protect } from '../modules/auth.js';

// Protected Routes
router.post('/medicalTreatments', protect, createMedicalTreatment);
router.delete('/medicalTreatment/:id', protect, deleteMedicalTreatment);

// Public Routes
router.get('/medicalTreatments', getAllMedicalTreatments);
router.get('/medicalTreatment/:id', getSingleMedicalTreatment);

export default router;
