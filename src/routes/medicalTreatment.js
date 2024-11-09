import express from 'express';
const router = express.Router();

import {
  createMedicalTreatment,
  deleteMedicalTreatment,
  getAllMedicalTreatments,
  getSingleMedicalTreatment,
  updateMedicalTreatment,
} from '../controllers/medicalTreatment.js';

import { protect } from '../modules/auth.js';
import {
  createMedicalTreatmentValidator,
  deleteMedicalTreatmentValidator,
  updateMedicalTreatmentValidator,
} from '../validators/medicalTreatmentValidator.js';
import { handleInputErrors } from '../modules/middleware.js';

// Protected Routes
router.post(
  '/medicalTreatments',
  protect,
  createMedicalTreatmentValidator,
  handleInputErrors,
  createMedicalTreatment
);
router.put(
  '/medicalTreatment/:id',
  protect,
  updateMedicalTreatmentValidator,
  handleInputErrors,
  updateMedicalTreatment
);
router.delete(
  '/medicalTreatment/:id',
  protect,
  deleteMedicalTreatmentValidator,
  handleInputErrors,
  deleteMedicalTreatment
);

// Public Routes
router.get('/medicalTreatments', getAllMedicalTreatments);
router.get(
  '/medicalTreatment/:id',
  getSingleMedicalTreatment,
  updateMedicalTreatmentValidator,
  handleInputErrors
);

export default router;
