import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalytics extends Document {
  user: mongoose.Types.ObjectId;
  combatStats: {
    kd: number;
    kills: number;
    deaths: number;
    assists: number;
  };
  accuracyStats: {
    headshotPercentage: number;
    totalShots: number;
    hits: number;
  };
  basicStats: {
    matchesPlayed: number;
    winRate: number;
    roundsPlayed: number;
  };
  utilityStats: {
    flashAssists: number;
    smokeKills: number;
    molotovDamage: number;
    heDamage: number;
  };
  mapPreferences: {
    [key: string]: {
      matches: number;
      winRate: number;
      kd: number;
    };
  };
  weaponPreferences: {
    [key: string]: {
      kills: number;
      headshots: number;
      accuracy: number;
    };
  };
  recentPerformance: Array<{
    date: string;
    kd: number;
    headshotPercentage: number;
    result: 'win' | 'loss';
  }>;
}

const AnalyticsSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  combatStats: {
    kd: { type: Number, default: 0 },
    kills: { type: Number, default: 0 },
    deaths: { type: Number, default: 0 },
    assists: { type: Number, default: 0 }
  },
  accuracyStats: {
    headshotPercentage: { type: Number, default: 0 },
    totalShots: { type: Number, default: 0 },
    hits: { type: Number, default: 0 }
  },
  basicStats: {
    matchesPlayed: { type: Number, default: 0 },
    winRate: { type: Number, default: 0 },
    roundsPlayed: { type: Number, default: 0 }
  },
  utilityStats: {
    flashAssists: { type: Number, default: 0 },
    smokeKills: { type: Number, default: 0 },
    molotovDamage: { type: Number, default: 0 },
    heDamage: { type: Number, default: 0 }
  },
  mapPreferences: {
    type: Map,
    of: {
      matches: { type: Number, default: 0 },
      winRate: { type: Number, default: 0 },
      kd: { type: Number, default: 0 }
    },
    default: {}
  },
  weaponPreferences: {
    type: Map,
    of: {
      kills: { type: Number, default: 0 },
      headshots: { type: Number, default: 0 },
      accuracy: { type: Number, default: 0 }
    },
    default: {}
  },
  recentPerformance: [{
    date: { type: String, required: true },
    kd: { type: Number, required: true },
    headshotPercentage: { type: Number, required: true },
    result: { type: String, enum: ['win', 'loss'], required: true }
  }]
}, { timestamps: true });

export default mongoose.model<IAnalytics>('Analytics', AnalyticsSchema); 