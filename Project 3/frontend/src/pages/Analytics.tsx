import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { Line, Bar, Radar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title as ChartTitleComponent,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { API_ENDPOINTS } from '../config/api';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  ChartTitleComponent,
  Tooltip,
  Legend,
  Filler
);

const Container = styled.div`
  padding: 100px 2rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%);
`;

const Title = styled.h1`
  color: #fff;
  font-size: 2.5rem;
  margin-bottom: 2.5rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: 0 0 20px rgba(100, 108, 255, 0.3);
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: linear-gradient(90deg, #646cff, #535bf2);
    border-radius: 2px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 1.5rem;
  padding: 2rem;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  }
`;

const StatTitle = styled.h3`
  color: #fff;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
`;

const ChartContainer = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 1.5rem;
  padding: 2rem;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  margin-bottom: 2rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  }
`;

const ChartTitle = styled.h2`
  color: #fff;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: center;
`;

const LoadingMessage = styled.div`
  color: #fff;
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 1.5rem;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

const ErrorMessage = styled.div`
  color: #f44336;
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  background: rgba(244, 67, 54, 0.1);
  border-radius: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(244, 67, 54, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

const OverallStatsContainer = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 1.5rem;
  padding: 2rem;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  margin-bottom: 2rem;
`;

const OverallStatsTitle = styled.h2`
  color: #fff;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: center;
`;

const OverallStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const SpeedometerContainer = styled.div`
  width: 150px;
  height: 150px;
  margin: 0 auto;
`;

const TimePlayedContainer = styled.div`
  background: rgba(100, 108, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
  margin-top: 2rem;
`;

const TimePlayedValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #646cff;
  margin-bottom: 0.5rem;
`;

const TimePlayedLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const PeriodSelector = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
`;

const PeriodButton = styled.button<{ active: boolean }>`
  background: ${props => props.active ? 'rgba(100, 108, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.active ? '#646cff' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.active ? '#646cff' : 'rgba(255, 255, 255, 0.7)'};
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(100, 108, 255, 0.1);
    border-color: #646cff;
    color: #646cff;
  }
`;

const MapTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 1rem;
  overflow: hidden;
`;

const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  color: #fff;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
`;

const TableCell = styled.td`
  padding: 1rem;
  color: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const TableRow = styled.tr`
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const MapFilter = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  justify-content: center;
`;

const FilterButton = styled.button<{ active: boolean }>`
  background: ${props => props.active ? 'rgba(100, 108, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.active ? '#646cff' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.active ? '#646cff' : 'rgba(255, 255, 255, 0.7)'};
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(100, 108, 255, 0.1);
    border-color: #646cff;
    color: #646cff;
  }
`;

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: '#fff',
        font: {
          size: 12,
          family: "'Inter', sans-serif"
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.05)'
      },
      ticks: {
        color: '#fff'
      }
    },
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.05)'
      },
      ticks: {
        color: '#fff'
      }
    }
  }
};

const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>({
    combatStats: {
      kd: 1.18,
      kills: 1250,
      deaths: 1059,
      assists: 450
    },
    accuracyStats: {
      headshotPercentage: 68.5,
      accuracy: 42.3,
      shotsFired: 25000,
      shotsHit: 10580
    },
    basicStats: {
      winRate: 58.7,
      matchesPlayed: 250,
      matchesWon: 147,
      matchesLost: 103
    },
    rating: 1.15,
    timePlayed: 37500, // хвилини (приблизно 26 днів)
    recentPerformance: [
      { date: '2024-03-20', kd: 1.25, headshotPercentage: 72 },
      { date: '2024-03-19', kd: 1.15, headshotPercentage: 65 },
      { date: '2024-03-18', kd: 1.30, headshotPercentage: 70 },
      { date: '2024-03-17', kd: 1.10, headshotPercentage: 68 },
      { date: '2024-03-16', kd: 1.20, headshotPercentage: 69 },
      { date: '2024-03-15', kd: 1.18, headshotPercentage: 67 },
      { date: '2024-03-14', kd: 1.22, headshotPercentage: 71 }
    ],
    utilityStats: {
      flashAssists: 45,
      smokeKills: 28,
      molotovDamage: 320,
      heDamage: 180
    },
    mapPreferences: {
      'Dust II': { winRate: 62, matches: 85 },
      'Mirage': { winRate: 58, matches: 75 },
      'Inferno': { winRate: 55, matches: 45 },
      'Nuke': { winRate: 52, matches: 25 },
      'Overpass': { winRate: 60, matches: 20 }
    },
    weaponPreferences: {
      'AK-47': { kills: 450, headshots: 315 },
      'M4A4': { kills: 380, headshots: 228 },
      'AWP': { kills: 320, headshots: 96 },
      'USP-S': { kills: 150, headshots: 120 },
      'Glock': { kills: 120, headshots: 72 }
    }
  });

  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');
  const [mapFilter, setMapFilter] = useState<'kd' | 'winRate' | 'matches'>('kd');

  const weeklyData = {
    kd: [
      { week: 'Week 1', value: 1.15 },
      { week: 'Week 2', value: 1.22 },
      { week: 'Week 3', value: 1.18 },
      { week: 'Week 4', value: 1.25 }
    ],
    headshots: [
      { match: 'Match 1', value: 65 },
      { match: 'Match 2', value: 72 },
      { match: 'Match 3', value: 68 },
      { match: 'Match 4', value: 70 },
      { match: 'Match 5', value: 75 }
    ],
    winLoss: [
      { date: 'Mon', wins: 4, losses: 2 },
      { date: 'Tue', wins: 3, losses: 3 },
      { date: 'Wed', wins: 5, losses: 1 },
      { date: 'Thu', wins: 2, losses: 4 },
      { date: 'Fri', wins: 6, losses: 2 },
      { date: 'Sat', wins: 4, losses: 3 },
      { date: 'Sun', wins: 3, losses: 2 }
    ],
    playTime: [
      { week: 'Week 1', hours: 12 },
      { week: 'Week 2', hours: 15 },
      { week: 'Week 3', hours: 10 },
      { week: 'Week 4', hours: 18 }
    ]
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        console.log('Початок завантаження даних');
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          console.log('Токен не знайдено, перенаправлення на логін');
          navigate('/login');
          return;
        }

        // Тимчасово вимикаємо реальний запит для тестування
        // const response = await fetch(API_ENDPOINTS.stats.analytics, {
        //   headers: {
        //     'Authorization': `Bearer ${token}`
        //   }
        // });

        // if (!response.ok) {
        //   if (response.status === 401) {
        //     navigate('/login');
        //     return;
        //   }
        //   throw new Error('Failed to fetch analytics');
        // }

        // const data = await response.json();
        
        // Використовуємо тестові дані
        const testData = {
          combatStats: {
            kd: 1.18,
            kills: 1250,
            deaths: 1059,
            assists: 450
          },
          accuracyStats: {
            headshotPercentage: 68.5,
            accuracy: 42.3,
            shotsFired: 25000,
            shotsHit: 10580
          },
          basicStats: {
            winRate: 58.7,
            matchesPlayed: 250,
            matchesWon: 147,
            matchesLost: 103
          },
          rating: 1.15,
          timePlayed: 37500,
          recentPerformance: [
            { date: '2024-03-20', kd: 1.25, headshotPercentage: 72 },
            { date: '2024-03-19', kd: 1.15, headshotPercentage: 65 },
            { date: '2024-03-18', kd: 1.30, headshotPercentage: 70 },
            { date: '2024-03-17', kd: 1.10, headshotPercentage: 68 },
            { date: '2024-03-16', kd: 1.20, headshotPercentage: 69 },
            { date: '2024-03-15', kd: 1.18, headshotPercentage: 67 },
            { date: '2024-03-14', kd: 1.22, headshotPercentage: 71 }
          ],
          utilityStats: {
            flashAssists: 45,
            smokeKills: 28,
            molotovDamage: 320,
            heDamage: 180
          },
          mapPreferences: {
            'Dust II': { winRate: 62, matches: 85 },
            'Mirage': { winRate: 58, matches: 75 },
            'Inferno': { winRate: 55, matches: 45 },
            'Nuke': { winRate: 52, matches: 25 },
            'Overpass': { winRate: 60, matches: 20 }
          },
          weaponPreferences: {
            'AK-47': { kills: 450, headshots: 315 },
            'M4A4': { kills: 380, headshots: 228 },
            'AWP': { kills: 320, headshots: 96 },
            'USP-S': { kills: 150, headshots: 120 },
            'Glock': { kills: 120, headshots: 72 }
          }
        };

        console.log('Отримані дані:', testData);
        setAnalytics(testData);
        console.log('Дані встановлені в стан');
      } catch (err) {
        console.error('Помилка при отриманні даних:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
        console.log('Завантаження завершено');
      }
    };

    fetchAnalytics();
  }, [navigate]);

  // Додаємо логування для перевірки стану
  useEffect(() => {
    console.log('Поточний стан analytics:', analytics);
  }, [analytics]);

  if (loading) {
    return <LoadingMessage>Loading analytics...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!analytics) {
    return null;
  }

  const kdData = {
    labels: analytics.recentPerformance.map((match: any) => match.date),
    datasets: [
      {
        label: 'K/D Ratio',
        data: analytics.recentPerformance.map((match: any) => match.kd),
        borderColor: '#646cff',
        backgroundColor: 'rgba(100, 108, 255, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const headshotData = {
    labels: analytics.recentPerformance.map((match: any) => match.date),
    datasets: [
      {
        label: 'Headshot %',
        data: analytics.recentPerformance.map((match: any) => match.headshotPercentage),
        backgroundColor: 'rgba(76, 175, 80, 0.6)',
        borderColor: '#4caf50',
        borderWidth: 1
      }
    ]
  };

  const utilityData = {
    labels: ['Flash Assists', 'Smoke Kills', 'Molotov Damage', 'HE Damage'],
    datasets: [
      {
        label: 'Utility Usage',
        data: [
          analytics.utilityStats.flashAssists || 45,
          analytics.utilityStats.smokeKills || 28,
          analytics.utilityStats.molotovDamage || 320,
          analytics.utilityStats.heDamage || 180
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const mapPerformanceData = {
    labels: Object.keys(analytics.mapPreferences),
    datasets: [
      {
        label: mapFilter === 'kd' ? 'K/D Ratio' : mapFilter === 'winRate' ? 'Win Rate %' : 'Matches Played',
        data: Object.values(analytics.mapPreferences).map((map: any) => 
          mapFilter === 'kd' ? map.kd : mapFilter === 'winRate' ? map.winRate : map.matches
        ),
        backgroundColor: 'rgba(100, 108, 255, 0.6)',
        borderColor: '#646cff',
        borderWidth: 1
      }
    ]
  };

  const weaponData = {
    labels: Object.keys(analytics.weaponPreferences),
    datasets: [
      {
        label: 'Kills',
        data: Object.values(analytics.weaponPreferences).map((weapon: any) => weapon.kills),
        backgroundColor: 'rgba(244, 67, 54, 0.6)',
        borderColor: '#f44336',
        borderWidth: 1
      }
    ]
  };

  const formatTimePlayed = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    
    if (days > 0) {
      return `${days}d ${remainingHours}h`;
    }
    return `${hours}h`;
  };

  return (
    <Container>
      <Title>Analytics Dashboard</Title>

      <OverallStatsContainer>
        <OverallStatsTitle>Загальна ефективність</OverallStatsTitle>
        <OverallStatsGrid>
          <StatItem>
            <SpeedometerContainer>
              <CircularProgressbar
                value={analytics.combatStats.kd * 50}
                maxValue={2}
                text={`${analytics.combatStats.kd.toFixed(2)}`}
                styles={buildStyles({
                  pathColor: `rgba(100, 108, 255, ${analytics.combatStats.kd / 2})`,
                  textColor: '#fff',
                  trailColor: 'rgba(255, 255, 255, 0.1)',
                  textSize: '24px'
                })}
              />
            </SpeedometerContainer>
            <StatLabel>Середній K/D</StatLabel>
          </StatItem>

          <StatItem>
            <SpeedometerContainer>
              <CircularProgressbar
                value={analytics.accuracyStats.headshotPercentage}
                text={`${analytics.accuracyStats.headshotPercentage.toFixed(1)}%`}
                styles={buildStyles({
                  pathColor: `rgba(76, 175, 80, ${analytics.accuracyStats.headshotPercentage / 100})`,
                  textColor: '#fff',
                  trailColor: 'rgba(255, 255, 255, 0.1)',
                  textSize: '24px'
                })}
              />
            </SpeedometerContainer>
            <StatLabel>Headshot %</StatLabel>
          </StatItem>

          <StatItem>
            <SpeedometerContainer>
              <CircularProgressbar
                value={analytics.basicStats.winRate}
                text={`${analytics.basicStats.winRate.toFixed(1)}%`}
                styles={buildStyles({
                  pathColor: `rgba(255, 193, 7, ${analytics.basicStats.winRate / 100})`,
                  textColor: '#fff',
                  trailColor: 'rgba(255, 255, 255, 0.1)',
                  textSize: '24px'
                })}
              />
            </SpeedometerContainer>
            <StatLabel>Win Rate</StatLabel>
          </StatItem>

          <StatItem>
            <SpeedometerContainer>
              <CircularProgressbar
                value={analytics.rating || 1.0}
                maxValue={1.5}
                text={`${(analytics.rating || 1.0).toFixed(2)}`}
                styles={buildStyles({
                  pathColor: `rgba(244, 67, 54, ${(analytics.rating || 1.0) / 1.5})`,
                  textColor: '#fff',
                  trailColor: 'rgba(255, 255, 255, 0.1)',
                  textSize: '24px'
                })}
              />
            </SpeedometerContainer>
            <StatLabel>HLTV Rating</StatLabel>
          </StatItem>
        </OverallStatsGrid>

        <TimePlayedContainer>
          <TimePlayedValue>
            {formatTimePlayed(analytics.timePlayed || 0)}
          </TimePlayedValue>
          <TimePlayedLabel>Загальний час гри</TimePlayedLabel>
        </TimePlayedContainer>
      </OverallStatsContainer>

      <ChartContainer>
        <ChartTitle>Динаміка за періодами</ChartTitle>
        
        <PeriodSelector>
          <PeriodButton 
            active={selectedPeriod === 'week'} 
            onClick={() => setSelectedPeriod('week')}
          >
            Тиждень
          </PeriodButton>
          <PeriodButton 
            active={selectedPeriod === 'month'} 
            onClick={() => setSelectedPeriod('month')}
          >
            Місяць
          </PeriodButton>
        </PeriodSelector>

        <div style={{ height: '400px', marginBottom: '2rem' }}>
          <Line 
            data={{
              labels: weeklyData.kd.map(item => item.week),
              datasets: [{
                label: 'K/D Ratio',
                data: weeklyData.kd.map(item => item.value),
                borderColor: '#646cff',
                backgroundColor: 'rgba(100, 108, 255, 0.1)',
                fill: true,
                tension: 0.4
              }]
            }} 
            options={chartOptions} 
          />
        </div>

        <div style={{ height: '400px', marginBottom: '2rem' }}>
          <Bar 
            data={{
              labels: weeklyData.headshots.map(item => item.match),
              datasets: [{
                label: 'Headshot %',
                data: weeklyData.headshots.map(item => item.value),
                backgroundColor: 'rgba(76, 175, 80, 0.6)',
                borderColor: '#4caf50',
                borderWidth: 1
              }]
            }} 
            options={chartOptions} 
          />
        </div>

        <div style={{ height: '400px', marginBottom: '2rem' }}>
          <Bar 
            data={{
              labels: weeklyData.winLoss.map(item => item.date),
              datasets: [
                {
                  label: 'Перемоги',
                  data: weeklyData.winLoss.map(item => item.wins),
                  backgroundColor: 'rgba(100, 108, 255, 0.6)',
                  borderColor: '#646cff',
                  borderWidth: 1
                },
                {
                  label: 'Поразки',
                  data: weeklyData.winLoss.map(item => item.losses),
                  backgroundColor: 'rgba(244, 67, 54, 0.6)',
                  borderColor: '#f44336',
                  borderWidth: 1
                }
              ]
            }} 
            options={chartOptions} 
          />
        </div>

        <div style={{ height: '400px' }}>
          <Line 
            data={{
              labels: weeklyData.playTime.map(item => item.week),
              datasets: [{
                label: 'Години гри',
                data: weeklyData.playTime.map(item => item.hours),
                borderColor: '#ff9800',
                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                fill: true,
                tension: 0.4
              }]
            }} 
            options={chartOptions} 
          />
        </div>
      </ChartContainer>

      <ChartContainer>
        <ChartTitle>Utility Usage</ChartTitle>
        <div style={{ height: '400px' }}>
          <Doughnut 
            data={utilityData} 
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const label = context.label || '';
                      const value = context.raw || 0;
                      let suffix = '';
                      
                      if (label.includes('Damage')) {
                        suffix = ' HP';
                      } else if (label.includes('Assists')) {
                        suffix = ' assists';
                      } else if (label.includes('Kills')) {
                        suffix = ' kills';
                      }
                      
                      return `${label}: ${value}${suffix}`;
                    }
                  }
                }
              }
            }} 
          />
        </div>
      </ChartContainer>

      <ChartContainer>
        <ChartTitle>Map Performance</ChartTitle>
        <MapFilter>
          <FilterButton 
            active={mapFilter === 'kd'} 
            onClick={() => setMapFilter('kd')}
          >
            K/D Ratio
          </FilterButton>
          <FilterButton 
            active={mapFilter === 'winRate'} 
            onClick={() => setMapFilter('winRate')}
          >
            Win Rate
          </FilterButton>
          <FilterButton 
            active={mapFilter === 'matches'} 
            onClick={() => setMapFilter('matches')}
          >
            Matches
          </FilterButton>
        </MapFilter>
        <div style={{ height: '400px' }}>
          <Bar data={mapPerformanceData} options={chartOptions} />
        </div>
        <MapTable>
          <thead>
            <tr>
              <TableHeader>Map</TableHeader>
              <TableHeader>K/D Ratio</TableHeader>
              <TableHeader>Win Rate</TableHeader>
              <TableHeader>Matches</TableHeader>
            </tr>
          </thead>
          <tbody>
            {Object.entries(analytics.mapPreferences).map(([map, stats]: [string, any]) => (
              <TableRow key={map}>
                <TableCell>{map}</TableCell>
                <TableCell>{stats.kd?.toFixed(2) || 'N/A'}</TableCell>
                <TableCell>{stats.winRate?.toFixed(1)}%</TableCell>
                <TableCell>{stats.matches}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </MapTable>
      </ChartContainer>

      <ChartContainer>
        <ChartTitle>Weapon Performance</ChartTitle>
        <div style={{ height: '400px' }}>
          <Bar data={weaponData} options={chartOptions} />
        </div>
      </ChartContainer>
    </Container>
  );
};

export default Analytics; 