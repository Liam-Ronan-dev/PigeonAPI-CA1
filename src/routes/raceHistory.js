import express from 'express';
const router = express.Router();

import { protect } from '../modules/auth.js';
import {
  createRaceHistory,
  deleteRaceHistory,
  getAllRaces,
  getSingleRaceHistory,
  updateRaceHistory,
} from '../controllers/raceHistory.js';
import {
  createRaceHistoryValidator,
  deleteRaceHistoryValidator,
  getRaceHistoryByIdValidator,
  updateRaceHistoryValidator,
} from '../validators/raceHistoryValidator.js';
import { handleInputErrors } from '../modules/middleware.js';

// Public Routes
router.get('/raceHistories', getAllRaces);
router.get(
  '/raceHistory/:id',
  getRaceHistoryByIdValidator,
  handleInputErrors,
  getSingleRaceHistory
);

//Protected Routes
router.post(
  '/raceHistory',
  protect,
  createRaceHistoryValidator,
  handleInputErrors,
  createRaceHistory
);
router.put(
  '/raceHistory/:id',
  protect,
  updateRaceHistoryValidator,
  handleInputErrors,
  updateRaceHistory
);
router.delete(
  '/raceHistory/:id',
  protect,
  deleteRaceHistoryValidator,
  handleInputErrors,
  deleteRaceHistory
);

export default router;
