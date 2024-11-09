import { Pigeon } from '../models/Pigeon.js';

export const getAllPigeons = async (req, res, next) => {
  try {
    const pigeons = await Pigeon.find()
      .populate({
        path: 'owner',
        model: 'User',
        select: 'username email',
      })
      .populate({
        path: 'medicalTreatments',
        model: 'MedicalTreatment',
        select: 'treatmentName dateAdministered description',
      })
      .populate({
        path: 'raceHistory',
        model: 'RaceHistory',
        select: 'raceName date positions',
      });

    res.status(200).json({ data: pigeons, message: 'success' });
  } catch (error) {
    console.error(error);

    // Pass the error to the next middleware - error handler in middleware.js
    next(error);
  }
};

export const getSinglePigeon = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the pigeon by ID
    const pigeon = await Pigeon.findById(id)
      .populate({
        path: 'owner',
        model: 'User',
        select: 'username email',
      })
      .populate({
        path: 'medicalTreatments',
        model: 'MedicalTreatment',
        select: 'treatmentName dateAdministered description',
      })
      .populate({
        path: 'raceHistory',
        model: 'RaceHistory',
        select: 'raceName date positions',
      });

    if (!pigeon) {
      return res.status(404).json({ message: 'Pigeon not found' });
    }

    res.status(200).json({ data: pigeon });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deletePigeon = async (req, res, next) => {
  try {
    const id = req.params.id;

    // Find and delete the pigeon by ID
    const pigeon = await Pigeon.findByIdAndDelete(id);

    if (!pigeon) {
      return res.status(404).json({ message: 'Pigeon not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    next(error);
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

    const pigeon = await Pigeon.create(pigeonData);

    // Respond with the created pigeon
    res
      .status(201)
      .json({ data: pigeon, message: `${name} successfully created` });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const updatePigeon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const pigeon = await Pigeon.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!pigeon) {
      return res.status(404).json({ message: 'Pigeon not found' });
    }

    res.status(200).json({
      data: pigeon,
      message: `${pigeon.name} updated successfully`,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
