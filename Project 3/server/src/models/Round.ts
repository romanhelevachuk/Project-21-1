import mongoose from 'mongoose';

export enum RoundWinner {
  T = 'T',
  CT = 'CT',
}

export interface RoundEvent {
  type: string;
  timestamp: number;
  player: mongoose.Types.ObjectId;
  details: Record<string, any>;
}

const roundSchema = new mongoose.Schema({
  match: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: true,
  },
  roundNumber: {
    type: Number,
    required: true,
  },
  winner: {
    type: String,
    enum: Object.values(RoundWinner),
    required: true,
  },
  events: [{
    type: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Number,
      required: true,
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
    },
    details: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
  }],
  duration: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Round = mongoose.model('Round', roundSchema); 