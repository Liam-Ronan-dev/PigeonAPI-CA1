import { MedicalTreatment } from '../models/MedicalTreatment.js';
import { Pigeon } from '../models/Pigeon.js';

export const getAllMedicalTreatments = async (req, res, next) => {
  try {
    const treatments = await MedicalTreatment.find().populate({
      path: 'pigeons',
      model: 'Pigeon',
      select: 'name ringNumber',
    });

    res.status(200).json({ data: treatments, message: 'success' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getSingleMedicalTreatment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const medicalTreatment = await MedicalTreatment.findById(id).populate({
      path: 'pigeons',
      model: 'Pigeon',
      select: 'name ringNumber',
    });

    if (!medicalTreatment) {
      return res.status(404).json({ message: 'Medical treatment not found' });
    }

    res.status(200).json({ data: medicalTreatment });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const createMedicalTreatment = async (req, res, next) => {
  try {
    const {
      treatmentName,
      description,
      dateAdministered,
      treatmentDuration,
      pigeons,
      administeredBy,
    } = req.body;

    const treatmentData = {
      treatmentName,
      description,
      dateAdministered,
      treatmentDuration,
      pigeons,
      administeredBy,
    };

    const medicalTreatment = await MedicalTreatment.create(treatmentData);

    if (pigeons && pigeons.length > 0) {
      await Pigeon.updateMany(
        { _id: { $in: pigeons } },
        { $push: { medicalTreatments: medicalTreatment._id } }
      );
    }

    res.status(201).json({
      data: medicalTreatment,
      message: `${treatmentName} successfully created`,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteMedicalTreatment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const medicalTreatment = await MedicalTreatment.findByIdAndDelete(id);

    if (!medicalTreatment) {
      return res.status(404).json({ message: 'Medical Treatment not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const updateMedicalTreatment = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updateData = req.body;

    const medicalTreatment = await MedicalTreatment.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!medicalTreatment) {
      return res.status(404).json({ message: 'medical Treatment not found' });
    }

    res.status(200).json({
      data: medicalTreatment,
      message: `${medicalTreatment.treatmentName} successfully updated`,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
