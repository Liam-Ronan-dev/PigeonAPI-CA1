import { body, param } from 'express-validator';
import mongoose from 'mongoose';

const medicalTreatmentValidations = [
  body('treatmentName')
    .notEmpty()
    .withMessage('Treatment name is required.')
    .isString()
    .withMessage('Treatment name must be a string.'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string if provided.'),

  body('dateAdministered')
    .notEmpty()
    .withMessage('Date administered is required.')
    .isISO8601()
    .toDate()
    .withMessage('Date administered must be a valid date - YYYY-MM-DD'),

  body('treatmentDuration')
    .optional()
    .isString()
    .withMessage('Treatment duration must be a string if provided.'),

  body('pigeons')
    .optional()
    .isArray()
    .withMessage('Pigeons must be an array if provided.')
    .custom((pigeons) => {
      for (const pigeon of pigeons) {
        if (!mongoose.Types.ObjectId.isValid(pigeon)) {
          throw new Error('All pigeon IDs must be valid Mongo IDs.');
        }
      }
      return true;
    }),

  body('administeredBy')
    .optional()
    .isString()
    .withMessage('Administered by must be a string if provided.'),
];

const idValidation = param('id')
  .isMongoId()
  .withMessage('Medical treatment ID must be a valid Mongo ID.');

// Validator for creating a new medical treatment
export const createMedicalTreatmentValidator = medicalTreatmentValidations;

// Validator for updating an existing medical treatment
export const updateMedicalTreatmentValidator = [
  idValidation,
  medicalTreatmentValidations,
];

// Validator for fetching a medical treatment by ID
export const getMedicalTreatmentByIdValidator = idValidation;

// Validator for deleting a medical treatment by ID
export const deleteMedicalTreatmentValidator = idValidation;
