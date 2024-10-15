import mongoose from 'mongoose';
import { MedicalTreatment } from '../models/MedicalTreatment.js';
import { Pigeon } from '../models/Pigeon.js';

export const getAllMedicalTreatments = async (req, res) => {
  try {
    const treatments = await MedicalTreatment.find().populate({
      path: 'pigeons',
      model: 'Pigeon',
      select: 'name ringNumber',
    });

    res.json({ data: treatments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', errors: err });
  }
};

export const getSingleMedicalTreatment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Medical Treatment ID' });
    }

    const medicalTreatment = await MedicalTreatment.findById(id).populate({
      path: 'pigeons',
      model: 'Pigeon',
      select: 'name ringNumber',
    });

    if (!medicalTreatment) {
      return res.status(404).json({ message: 'Medical treatment not found' });
    }

    res.json({ data: medicalTreatment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createMedicalTreatment = async (req, res) => {
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

    res.status(201).json({ data: medicalTreatment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', errors: err });
  }
};

export const deleteMedicalTreatment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: `Invalid medical treatment ID: ${id}` });
    }

    const medicalTreatment = await MedicalTreatment.findByIdAndDelete(id);

    if (!medicalTreatment) {
      return res.status(404).json({ message: 'Medical Treatment not found' });
    }

    res.json({ message: `Medical Treatment - id:${id} deleted successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', errors: err });
  }
};

export const updateMedicalTreatment = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Medical Treatment ID' });
    }

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

    res.json({ data: medicalTreatment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'server error', errors: error });
  }
};
