import { MedicalTreatment } from '../models/MedicalTreatment.js';
import { Pigeon } from '../models/Pigeon.js';

export const getAllMedicalTreatments = async (req, res, next) => {
  try {
    const treatments = await MedicalTreatment.find().populate({
      path: 'pigeons',
      model: 'Pigeon',
      select: 'name ringNumber',
    });

    if (!treatments) {
      return res.status(404).json({
        message: 'Currently, there is no archived Medical Treatments',
      });
    }

    res.status(200).json({
      data: treatments,
      message: 'successfully retrieved all Treatments',
    });
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

    // Verify Ownership of Pigeons - so logged in user can't create a treatment
    // for a pigeon they don't own
    if (pigeons && pigeons.length > 0) {
      const ownedPigeons = await Pigeon.find({
        _id: { $in: pigeons },
        owner: req.user.id,
      });

      if (ownedPigeons.length !== pigeons.length) {
        return res.status(403).json({
          message:
            'You are not authorized to create a medical treatment for pigeons that you do not own.',
        });
      }
    }

    const treatmentData = {
      treatmentName,
      description,
      dateAdministered,
      treatmentDuration,
      pigeons,
      administeredBy,
      owner: req.user.id,
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

    // Find the medical treatment by ID and owner
    const medicalTreatment = await MedicalTreatment.findOneAndDelete({
      _id: id,
      owner: req.user.id,
    });

    if (!medicalTreatment) {
      return res.status(404).json({
        message: 'Medical Treatment not found or not authorized to delete.',
      });
    }

    res.status(200).json({
      message: `Medical Treatment: ${medicalTreatment.treatmentName} deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const updateMedicalTreatment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.pigeons && updateData.pigeons.length > 0) {
      const ownedPigeons = await Pigeon.find({
        _id: { $in: updateData.pigeons },
        owner: req.user.id,
      });

      if (ownedPigeons.length !== updateData.pigeons.length) {
        return res.status(403).json({
          message:
            'You are not authorized to assign a medical treatment to pigeons that you do not own.',
        });
      }
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

    res.status(200).json({
      data: medicalTreatment,
      message: `${medicalTreatment.treatmentName} successfully updated`,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
