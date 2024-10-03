import mongoose from 'mongoose';

const PigeonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ringNumber: { type: String, required: true, unique: true },
  sex: { type: String, enum: ['Male', 'Female'], required: true },
  breed: { type: String },
  colour: { type: String },
  eyeColour: { type: String },
  bodyType: { type: String },
  diet: { type: String },
  hatchDate: { type: Date },
  image: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicalTreatments: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'MedicalTreatment' },
  ],
  raceHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RaceHistory' }],
});

export const Pigeon = mongoose.model('Pigeon', PigeonSchema);
