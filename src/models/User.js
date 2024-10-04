import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  // uuid: { type: mongoose.Schema.Types.UUID, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  pigeons: { type: mongoose.Schema.Types.ObjectId, ref: 'Pigeon' },
});

export const User = mongoose.model('User', UserSchema);
