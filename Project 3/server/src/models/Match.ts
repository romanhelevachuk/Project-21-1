import mongoose, { Document } from 'mongoose';

export interface IMatch extends Document {
  player: mongoose.Types.ObjectId;
  date: Date;
  map: string;
  opponent: string;
  result: 'win' | 'loss';
  score: string;
  kills: number;
  deaths: number;
  assists: number;
  headshots: number;
  shots: number;
  bestWeapon: string;
  mvp: boolean;
  roundsWon: number;
  roundsLost: number;
  utilityDamage: number;
  flashAssists: number;
  enemiesFlashed: number;
  smokeAssists: number;
  molotovDamage: number;
  grenadeDamage: number;
  moneySpent: number;
  moneyEarned: number;
  clutchWins: number;
  oneVXWins: number;
  entryKills: number;
  entryDeaths: number;
  tradeKills: number;
  tradeDeaths: number;
  teamKills: number;
  teamDamage: number;
  timeAlive: number;
  timeDead: number;
  bombPlants: number;
  bombDefuses: number;
  hostageRescues: number;
  hostageDefends: number;
}

const matchSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  map: {
    type: String,
    required: true
  },
  opponent: {
    type: String,
    required: true
  },
  result: {
    type: String,
    enum: ['win', 'loss'],
    required: true
  },
  score: {
    type: String,
    required: true
  },
  kills: {
    type: Number,
    required: true,
    default: 0
  },
  deaths: {
    type: Number,
    required: true,
    default: 0
  },
  assists: {
    type: Number,
    required: true,
    default: 0
  },
  headshots: {
    type: Number,
    required: true,
    default: 0
  },
  shots: {
    type: Number,
    required: true,
    default: 0
  },
  bestWeapon: {
    type: String,
    required: true
  },
  mvp: {
    type: Boolean,
    default: false
  },
  roundsWon: {
    type: Number,
    required: true,
    default: 0
  },
  roundsLost: {
    type: Number,
    required: true,
    default: 0
  },
  utilityDamage: {
    type: Number,
    required: true,
    default: 0
  },
  flashAssists: {
    type: Number,
    required: true,
    default: 0
  },
  enemiesFlashed: {
    type: Number,
    required: true,
    default: 0
  },
  smokeAssists: {
    type: Number,
    required: true,
    default: 0
  },
  molotovDamage: {
    type: Number,
    required: true,
    default: 0
  },
  grenadeDamage: {
    type: Number,
    required: true,
    default: 0
  },
  moneySpent: {
    type: Number,
    required: true,
    default: 0
  },
  moneyEarned: {
    type: Number,
    required: true,
    default: 0
  },
  clutchWins: {
    type: Number,
    required: true,
    default: 0
  },
  oneVXWins: {
    type: Number,
    required: true,
    default: 0
  },
  entryKills: {
    type: Number,
    required: true,
    default: 0
  },
  entryDeaths: {
    type: Number,
    required: true,
    default: 0
  },
  tradeKills: {
    type: Number,
    required: true,
    default: 0
  },
  tradeDeaths: {
    type: Number,
    required: true,
    default: 0
  },
  teamKills: {
    type: Number,
    required: true,
    default: 0
  },
  teamDamage: {
    type: Number,
    required: true,
    default: 0
  },
  timeAlive: {
    type: Number,
    required: true,
    default: 0
  },
  timeDead: {
    type: Number,
    required: true,
    default: 0
  },
  bombPlants: {
    type: Number,
    required: true,
    default: 0
  },
  bombDefuses: {
    type: Number,
    required: true,
    default: 0
  },
  hostageRescues: {
    type: Number,
    required: true,
    default: 0
  },
  hostageDefends: {
    type: Number,
    required: true,
    default: 0
  }
});

export const Match = mongoose.model<IMatch>('Match', matchSchema); 