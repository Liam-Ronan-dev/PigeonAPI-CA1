import { body, param } from 'express-validator';

// Validator for creating a new pigeon
export const createPigeonValidator = [
  body('name')
    .notEmpty()
    .withMessage('Pigeon name is required.')
    .isString()
    .withMessage('Pigeon name must be a string.'),

  body('ringNumber')
    .notEmpty()
    .withMessage('Ring number is required.')
    .isString()
    .withMessage('Ring number must be a string.'),

  body('sex')
    .isIn(['Hen', 'Cock'])
    .withMessage('Sex must be either Hen or Cock.')
    .notEmpty()
    .withMessage('Sex is required.'),

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

  body('owner')
    .optional() // Assuming the owner will be automatically assigned from req.user, so we don't require it here
    .isMongoId()
    .withMessage('Owner ID must be a valid Mongo ID if provided.'),
];

// Validator for updating an existing pigeon
export const updatePigeonValidator = [
  param('id').isMongoId().withMessage('Pigeon ID must be a valid Mongo ID.'),

  body('name')
    .optional()
    .isString()
    .withMessage('Pigeon name must be a string if provided.'),

  body('ringNumber')
    .optional()
    .isString()
    .withMessage('Ring number must be a string if provided.'),

  body('sex')
    .optional()
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
    .withMessage('Hatch date must be a valid ISO 8601 date.'),
];

// Validator for fetching a pigeon by ID
export const getPigeonByIdValidator = [
  param('id').isMongoId().withMessage('Pigeon ID must be a valid Mongo ID.'),
];

// Validator for deleting a pigeon by ID
export const deletePigeonValidator = [
  param('id').isMongoId().withMessage('Pigeon ID must be a valid Mongo ID.'),
];
