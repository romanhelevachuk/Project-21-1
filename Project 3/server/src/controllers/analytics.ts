import { Request, Response } from 'express';
import Analytics from '../models/Analytics';

interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

export const getAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    let analytics = await Analytics.findOne({ user: userId });

    if (!analytics) {
      // Create default analytics if none exists
      analytics = await Analytics.create({
        user: userId,
        combatStats: {
          kd: 1.0,
          kills: 0,
          deaths: 0,
          assists: 0
        },
        accuracyStats: {
          headshotPercentage: 0,
          totalShots: 0,
          hits: 0
        },
        basicStats: {
          matchesPlayed: 0,
          winRate: 0,
          roundsPlayed: 0
        },
        utilityStats: {
          flashAssists: 0,
          smokeKills: 0,
          molotovDamage: 0,
          heDamage: 0
        },
        mapPreferences: {},
        weaponPreferences: {},
        recentPerformance: []
      });
    }

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const analytics = await Analytics.findOneAndUpdate(
      { user: userId },
      { $set: req.body },
      { new: true, upsert: true }
    );

    res.json(analytics);
  } catch (error) {
    console.error('Error updating analytics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 