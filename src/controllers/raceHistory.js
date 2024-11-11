import { RaceHistory } from '../models/RaceHistory.js';
import { Pigeon } from '../models/Pigeon.js';

export const getAllRaces = async (req, res, next) => {
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

    res.status(200).json({
      data: races,
      message: 'successfully retrieved all Race Histories',
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const createRaceHistory = async (req, res, next) => {
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

    res
      .status(201)
      .json({ data: race, message: `${raceName} successfully created` });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getSingleRaceHistory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const race = await RaceHistory.findById(id).populate({
      path: 'pigeons',
      model: 'Pigeon',
      select: 'name ringNumber',
    });

    if (!race) {
      return res.status(404).json({ message: 'Race not found' });
    }

    res.status(200).json({
      data: race,
      message: `Successfully retrieved the ${race.raceName}`,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteRaceHistory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const race = await RaceHistory.findByIdAndDelete(id);

    if (!race) {
      return res.status(404).json({ message: 'Race not found' });
    }

    res
      .status(200)
      .json({ message: `Race ${race.raceName} deleted successfully` });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const updateRaceHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const raceHistory = await RaceHistory.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!raceHistory) {
      return res.status(404).json({ message: 'race History not found' });
    }

    res.status(200).json({
      data: raceHistory,
      message: `${raceHistory.raceName} updated successfully`,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
