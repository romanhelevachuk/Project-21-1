import mongoose from 'mongoose';

const statsSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true,
  },
  match: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: true,
  },
  kills: {
    type: Number,
    default: 0,
  },
  deaths: {
    type: Number,
    default: 0,
  },
  assists: {
    type: Number,
    default: 0,
  },
  headshots: {
    type: Number,
    default: 0,
  },
  headshotPercentage: {
    type: Number,
    default: 0,
  },
  adr: { // Average Damage per Round
    type: Number,
    default: 0,
  },
  utilityDamage: {
    type: Number,
    default: 0,
  },
  utilityThrown: {
    type: Number,
    default: 0,
  },
  clutches: {
    type: Number,
    default: 0,
  },
  kd: {
    type: Number,
    default: 0,
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
statsSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Calculate K/D ratio before saving
statsSchema.pre('save', function(next) {
  if (this.deaths === 0) {
    this.kd = this.kills;
  } else {
    this.kd = this.kills / this.deaths;
  }
  next();
});

// Calculate headshot percentage before saving
statsSchema.pre('save', function(next) {
  if (this.kills === 0) {
    this.headshotPercentage = 0;
  } else {
    this.headshotPercentage = (this.headshots / this.kills) * 100;
  }
  next();
});

export const Stats = mongoose.model('Stats', statsSchema); 