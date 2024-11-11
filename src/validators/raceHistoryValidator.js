import mongoose from 'mongoose';
import { body, param } from 'express-validator';

const raceHistoryValidations = [
  body('raceName')
    .notEmpty()
    .withMessage('Race name is required.')
    .isString()
    .withMessage('Race name must be a string.'),

  body('date')
    .notEmpty()
    .withMessage('Date is required.')
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date format (YYYY-MM-DD).'),

  body('distance')
    .optional()
    .isString()
    .withMessage('Distance must be a string if provided.'),

  body('positions')
    .optional()
    .isArray()
    .withMessage('Positions must be an array of strings if provided.')
    .custom((positions) => {
      if (!positions.every((pos) => typeof pos === 'string')) {
        throw new Error('Each position must be a string.');
      }
      return true;
    }),

  body('totalParticipants')
    .optional()
    .isInt({ min: 24 })
    .withMessage('Total participants must be an integer greater than 24.'),

  body('windSpeed')
    .optional()
    .isString()
    .withMessage('Wind speed must be a string if provided.'),

  body('windDirection')
    .optional()
    .isIn(['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'])
    .withMessage('Wind direction must be one of: N, NE, E, SE, S, SW, W, NW.'),

  body('pigeons')
    .optional()
    .isArray()
    .withMessage('Pigeons must be an array of Mongo IDs if provided.')
    .custom((pigeons) => {
      if (!pigeons.every((id) => mongoose.Types.ObjectId.isValid(id))) {
        throw new Error('Each pigeon ID must be a valid Mongo ID.');
      }
      return true;
    }),

  body('notes')
    .optional()
    .isString()
    .withMessage('Notes must be a string if provided.'),
];

const idValidation = param('id')
  .isMongoId()
  .withMessage('RaceHistory ID must be a valid Mongo ID.');

export const createRaceHistoryValidator = raceHistoryValidations;

export const updateRaceHistoryValidator = [
  idValidation,
  raceHistoryValidations,
];

// Validator for getting RaceHistory by ID
export const getRaceHistoryByIdValidator = idValidation;

// Validator for deleting RaceHistory by ID
export const deleteRaceHistoryValidator = idValidation;
