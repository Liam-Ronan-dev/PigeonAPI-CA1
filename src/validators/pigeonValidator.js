import { body, param } from 'express-validator';

// Rather than writing code twice
const pigeonValidations = [
  body('name')
    .notEmpty()
    .withMessage('Pigeon name is required.')
    .bail()
    .isString()
    .withMessage('Pigeon name must be a string.'),

  body('ringNumber')
    .notEmpty()
    .withMessage('Ring number is required.')
    .bail()
    .isString()
    .withMessage('Ring number must be a string.'),

  body('sex')
    .notEmpty()
    .withMessage('Sex is required.')
    .bail()
    .isIn(['Hen', 'Cock'])
    .withMessage('Sex must be either Hen or Cock.'),

  body('breed')
    .optional()
    .isString()
    .withMessage('Breed must be a string if provided.'),

  body('colour')
    .optional()
    .isString()
    .withMessage('Colour must be a string if provided.'),

  body('eyeColour')
    .optional()
    .isString()
    .withMessage('Eye colour must be a string if provided.'),

  body('bodyType')
    .optional()
    .isString()
    .withMessage('Body type must be a string if provided.'),

  body('diet')
    .optional()
    .isString()
    .withMessage('Diet must be a string if provided.'),

  body('hatchDate')
    .optional()
    .isISO8601()
    .withMessage('Hatch date must be a valid ISO 8601 date. - YYYY-MM-DD'),
];

const idValidation = param('id')
  .isMongoId()
  .withMessage('Pigeon ID must be a valid Mongo ID.');

// Validator for creating a new pigeon
export const createPigeonValidator = pigeonValidations;

// Validator for updating an existing pigeon
export const updatePigeonValidator = [idValidation, pigeonValidations];

// Validator for fetching a pigeon by ID
export const getPigeonByIdValidator = idValidation;

// Validator for deleting a pigeon by ID
export const deletePigeonValidator = idValidation;
