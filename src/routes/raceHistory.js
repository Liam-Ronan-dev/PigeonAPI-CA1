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

// Public Routes
router.get('/raceHistories', getAllRaces);
router.get('/raceHistory/:id', getSingleRaceHistory);

//Protected Routes
router.post('/raceHistory', protect, createRaceHistory);
router.put('/raceHistory/:id', protect, updateRaceHistory);
router.delete('/raceHistory/:id', protect, deleteRaceHistory);

export default router;
