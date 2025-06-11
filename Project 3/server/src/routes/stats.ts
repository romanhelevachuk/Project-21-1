import express, { Request } from 'express';
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { Player } from '../models/Player';
import { Match } from '../models/Match';
import { getAnalytics, updateAnalytics } from '../controllers/analytics';

interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

const router: Router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get player profile
router.get('/profile', async (req: AuthRequest, res) => {
  try {
    const player = await Player.findOne({ user: req.user?.userId });
    
    if (!player) {
      return res.status(404).json({ message: 'Player profile not found' });
    }

    // Calculate statistics
    const matches = await Match.find({ player: player._id });
    const matchesPlayed = matches.length;
    const matchesWon = matches.filter(m => m.result === 'win').length;
    const matchesLost = matchesPlayed - matchesWon;
    const totalKills = matches.reduce((sum, m) => sum + m.kills, 0);
    const totalDeaths = matches.reduce((sum, m) => sum + m.deaths, 0);
    const totalHeadshots = matches.reduce((sum, m) => sum + m.headshots, 0);
    const totalShots = matches.reduce((sum, m) => sum + m.shots, 0);

    res.json({
      username: player.nickname,
      rank: player.rank,
      avatar: player.avatar,
      matchesPlayed,
      matchesWon,
      matchesLost,
      kdRatio: totalDeaths === 0 ? totalKills : totalKills / totalDeaths,
      headshotPercentage: totalShots === 0 ? 0 : (totalHeadshots / totalShots) * 100,
      averageScore: matches.length === 0 ? 0 : matches.reduce((sum, m) => {
        const score = parseInt(m.score.split('-')[0]);
        return sum + (isNaN(score) ? 0 : score);
      }, 0) / matches.length
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get match history with filters
router.get('/matches', async (req: AuthRequest, res) => {
  try {
    const player = await Player.findOne({ user: req.user?.userId });
    
    if (!player) {
      return res.status(404).json({ message: 'Player profile not found' });
    }

    // Build filter object based on query parameters
    const filter: any = { player: player._id };

    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      filter.date = {};
      if (req.query.startDate) {
        filter.date.$gte = new Date(req.query.startDate as string);
      }
      if (req.query.endDate) {
        filter.date.$lte = new Date(req.query.endDate as string);
      }
    }

    // Map filter
    if (req.query.map) {
      filter.map = req.query.map;
    }

    // Result filter (win/loss)
    if (req.query.result) {
      filter.result = (req.query.result as string).toLowerCase();
    }

    // Score range filter
    if (req.query.minScore || req.query.maxScore) {
      filter.score = {};
      if (req.query.minScore) {
        filter.score.$gte = parseInt(req.query.minScore as string);
      }
      if (req.query.maxScore) {
        filter.score.$lte = parseInt(req.query.maxScore as string);
      }
    }

    // K/D ratio filter
    if (req.query.minKd || req.query.maxKd) {
      const matches = await Match.find(filter);
      const filteredMatches = matches.filter(match => {
        const kd = match.deaths === 0 ? match.kills : match.kills / match.deaths;
        if (req.query.minKd && kd < parseFloat(req.query.minKd as string)) return false;
        if (req.query.maxKd && kd > parseFloat(req.query.maxKd as string)) return false;
        return true;
      });
      return res.json(filteredMatches.map(match => ({
        id: match._id,
        date: match.date,
        map: match.map,
        opponent: match.opponent,
        result: match.result.toLowerCase(),
        score: match.score,
        kd: match.deaths === 0 ? match.kills : match.kills / match.deaths,
        kills: match.kills,
        deaths: match.deaths,
        assists: match.assists,
        headshots: match.headshots,
        mvp: match.mvp,
        roundsWon: match.roundsWon,
        roundsLost: match.roundsLost
      })));
    }

    // Get matches with pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const matches = await Match.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Match.countDocuments(filter);

    res.json({
      matches: matches.map(match => ({
        id: match._id,
        date: match.date,
        map: match.map,
        opponent: match.opponent,
        result: match.result.toLowerCase(),
        score: match.score,
        kd: match.deaths === 0 ? match.kills : match.kills / match.deaths,
        kills: match.kills,
        deaths: match.deaths,
        assists: match.assists,
        headshots: match.headshots,
        mvp: match.mvp,
        roundsWon: match.roundsWon,
        roundsLost: match.roundsLost
      })),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Analytics routes
router.get('/analytics', getAnalytics);
router.put('/analytics', updateAnalytics);

export default router; 