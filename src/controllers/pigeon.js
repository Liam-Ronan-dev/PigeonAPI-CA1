import mongoose from 'mongoose';
import { Pigeon } from '../models/Pigeon.js';

export const getAllPigeons = async (req, res) => {
  try {
    const pigeons = await Pigeon.find().populate('owner', 'username email');
    //   .populate('medicalTreatments')
    //   .populate('raceHistory');

    res.json({ data: pigeons });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', errors: err });
  }
};

export const getSinglePigeon = async (req, res) => {
  try {
    const id = req.params.id;

    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid pigeon ID' });
    }

    // Find the pigeon by ID
    const pigeon = await Pigeon.findById(id).populate(
      'owner',
      'username email'
    );
    //   .populate('medicalTreatments')
    //   .populate('raceHistory');

    // Check if pigeon exists
    if (!pigeon) {
      return res.status(404).json({ message: 'Pigeon not found' });
    }

    // Return the pigeon data
    res.json({ data: pigeon });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deletePigeon = async (req, res) => {
  try {
    const id = req.params.id;

    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid pigeon ID' });
    }

    // Find and delete the pigeon by ID
    const pigeon = await Pigeon.findByIdAndDelete(id);

    // Check if pigeon exists
    if (!pigeon) {
      return res.status(404).json({ message: 'Pigeon not found' });
    }

    // Return a success message
    res.json({ message: `Pigeon deleted successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', errors: err });
  }
};

export const createPigeon = async (req, res, next) => {
  try {
    const {
      name,
      ringNumber,
      breed,
      sex,
      hatchDate,
      colour,
      eyeColour,
      bodyType,
      diet,
    } = req.body;

    const pigeonData = {
      name,
      ringNumber,
      breed,
      sex,
      hatchDate,
      colour,
      eyeColour,
      bodyType,
      diet,
      owner: req.user.id, // Assuming auth middleware sets req.user
    };

    // Include the image path if an image was uploaded
    // if (req.file) {
    //   pigeonData.image = req.file.path;
    // }

    // Create the pigeon in the database
    const pigeon = await Pigeon.create(pigeonData);

    // Respond with the created pigeon
    res.status(201).json({ data: pigeon });
  } catch (error) {
    console.error(error);

    // Handle specific errors (e.g., validation errors)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ msg: error.message, errors: error.errors });
    }

    // Pass the error to the next middleware (could be an error handler)
    next(error);
  }
};

export const updatePigeon = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Pigeon ID' });
    }

    const pigeon = await Pigeon.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!pigeon) {
      return res.status(404).json({ message: 'Pigeon not found' });
    }

    res.json({ data: pigeon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'server error', errors: error });
  }
};
