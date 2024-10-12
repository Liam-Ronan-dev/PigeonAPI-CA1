import mongoose from 'mongoose';

const RaceHistorySchema = new mongoose.Schema({
  raceName: { type: String, required: true },
  date: { type: Date, required: true },
  distance: { type: String },
  positions: { type: [String] },
  totalParticipants: { type: Number },
  windSpeed: { type: String },
  windDirection: {
    type: String,
    enum: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
  },
  pigeons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pigeon' }],
  notes: { type: String },
});

export const RaceHistory = mongoose.model('RaceHistory', RaceHistorySchema);
