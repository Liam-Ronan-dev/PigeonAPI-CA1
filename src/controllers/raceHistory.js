import mongoose from 'mongoose';
import { RaceHistory } from '../models/RaceHistory.js';
import { Pigeon } from '../models/Pigeon.js';

export const getAllRaces = async (req, res) => {
  try {
    const races = await RaceHistory.find().populate({
      path: 'pigeons',
      model: 'Pigeon',
      select: 'name ringNumber',
    });

    if (!races) {
      return res
        .status(404)
        .json({ message: 'Currently, there is no archived Races' });
    }

    res.json({ data: races });
  } catch (error) {
    console.error(`Error retrieving all Races: ${error}`);
    res.status(500).json({ message: 'Server error', errors: error });
  }
};

export const createRaceHistory = async (req, res) => {
  try {
    const {
      pigeons,
      raceName,
      date,
      distance,
      positions,
      totalParticipants,
      windSpeed,
      windDirection,
      notes,
    } = req.body;

    const raceData = {
      pigeons,
      raceName,
      date,
      distance,
      positions,
      totalParticipants,
      windSpeed,
      windDirection,
      notes,
    };

    const race = await RaceHistory.create(raceData);

    if (pigeons && pigeons.length > 0) {
      await Pigeon.updateMany(
        { _id: { $in: pigeons } },
        { $push: { raceHistory: race._id } }
      );
    }

    res.status(200).json({ data: race });
  } catch (error) {
    console.error(`Error creating pigeon: ${error}`);
    res.status(500).json({ message: 'Server error', errors: error });
  }
};

export const getSingleRaceHistory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: `No pigeon with this id: ${id}` });
    }

    const race = await RaceHistory.findById(id).populate({
      path: 'pigeons',
      model: 'Pigeon',
      select: 'name ringNumber',
    });

    if (!race) {
      return res.status(404).json({ message: 'Race not found' });
    }

    res.status(200).json({ data: race });
  } catch (error) {
    console.error(`Error finding pigeon with that ID: ${error}`);
    res.status().json({ message: 'Server error', errors: error });
  }
};

export const deleteRaceHistory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: `Invalid Race history ID: ${id}` });
    }

    const race = await RaceHistory.findByIdAndDelete(id);

    if (!race) {
      return res.status(404).json({ message: 'Race not found' });
    }

    res.json({ message: `Race deleted successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', errors: err });
  }
};
