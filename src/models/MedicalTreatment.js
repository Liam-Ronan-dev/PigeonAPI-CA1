import mongoose from 'mongoose';

const MedicalTreatmentSchema = new mongoose.Schema({
  treatmentName: { type: String, required: true },
  description: { type: String },
  dateAdministered: { type: Date, required: true },
  treatmentDuration: { type: String },
  pigeons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pigeon' }],
  administeredBy: { type: String },
});

export const MedicalTreatment = mongoose.model(
  'MedicalTreatment',
  MedicalTreatmentSchema
);
