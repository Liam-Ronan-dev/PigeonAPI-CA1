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

    if (!pigeons) {
      return res
        .status(404)
        .json({ message: 'Currently, there is no archived Pigeons' });
    }

    res
      .status(200)
      .json({ data: pigeons, message: 'successfully retrieved all Pigeons' });
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

    res
      .status(200)
      .json({ data: pigeon, message: `Successfully retrieved ${pigeon.name}` });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deletePigeon = async (req, res, next) => {
  try {
    const id = req.params.id;

    // Find the pigeon by ID
    const pigeon = await Pigeon.findOne({
      _id: id,
    });

    if (!pigeon) {
      return res.status(404).json({ message: 'Pigeon not found' });
    }

    // Check if the logged-in user is the owner of the pigeon
    if (pigeon.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to Delete this pigeon.' });
    }

    await pigeon.deleteOne();

    res
      .status(200)
      .json({ message: `Pigeon ${pigeon.name} deleted successfully` });
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
    if (req.file) {
      pigeonData.imageUrl =
        process.env.STORAGE_ENGINE === 'S3' ? req.file.key : req.file.filename;
    }

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

    if (req.file) {
      updateData.imageUrl =
        process.env.STORAGE_ENGINE === 'S3' ? req.file.key : req.file.filename;
    }

    // Find the pigeon by ID and ensure it belongs to the logged-in user
    const pigeon = await Pigeon.findOneAndUpdate(
      { _id: id, owner: req.user.id }, // Ensure the owner matches the logged-in user
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!pigeon) {
      return res.status(404).json({
        message:
          'Pigeon not found or you are not authorised to update this pigeon',
      });
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
