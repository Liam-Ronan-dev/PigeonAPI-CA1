import mongoose from 'mongoose';

const RaceHistorySchema = new mongoose.Schema({
  pigeon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pigeon',
    required: true,
  },
  raceName: { type: String, required: true },
  date: { type: Date, required: true },
  distance: { type: Number },
  position: { type: [Number] },
  totalParticipants: { type: Number },
  windSpeed: { type: Number },
  windDirection: {
    type: String,
    enum: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
  },
  notes: { type: String },
});
