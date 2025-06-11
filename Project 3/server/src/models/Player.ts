import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true,
    trim: true,
  },
  steamId: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  avatar: {
    type: String,
  },
  rank: {
    type: String,
    default: 'Unranked',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
playerSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Player = mongoose.model('Player', playerSchema); 