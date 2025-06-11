import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { API_ENDPOINTS, getAuthHeader } from '../config/api';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 100px 20px 40px;
`;

const ProfileCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const PortfolioHeader = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  gap: 30px;
  position: relative;
`;

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid #4a90e2;
  box-shadow: 0 0 20px rgba(74, 144, 226, 0.3);
  object-fit: cover;
`;

const UserInfo = styled.div`
  color: #fff;
  flex: 1;
`;

const Username = styled.h1`
  font-size: 2.5rem;
  margin: 0;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const Rank = styled.div`
  display: inline-block;
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const SteamId = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Country = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UpdateButton = styled.button`
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);

  &:hover {
    transform: translateY(-50%) scale(1.05);
    box-shadow: 0 5px 15px rgba(74, 144, 226, 0.3);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 40px;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  color: #fff;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const StatTitle = styled.h3`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 10px 0;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #4a90e2;
`;

const ErrorMessage = styled.div`
  background: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.2);
  color: #ff3b30;
  padding: 15px;
  border-radius: 10px;
  font-size: 0.9rem;
  text-align: center;
  margin: 20px auto;
  max-width: 400px;
`;

const LoadingMessage = styled.div`
  color: #fff;
  text-align: center;
  font-size: 1.2rem;
  margin: 40px 0;
`;

const ChartsContainer = styled.div`
  margin-top: 40px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
`;

const ChartCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  color: #fff;
`;

const ChartTitle = styled.h3`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 20px 0;
  text-align: center;
`;

const MatchHistoryContainer = styled.div`
  margin-top: 40px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  overflow-x: auto;
`;

const MatchHistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const MatchHistoryTitle = styled.h2`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0;
`;

const MatchStats = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 20px;
`;

const MatchCount = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MatchCountValue = styled.span`
  color: #4a90e2;
  font-weight: 600;
`;

const UpdateMatchButton = styled.button`
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(74, 144, 226, 0.3);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const MatchTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: #fff;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 1px;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const TableCell = styled.td`
  padding: 12px;
  font-size: 0.9rem;
`;

const WinCell = styled(TableCell)`
  color: #4a90e2;
  font-weight: 600;
`;

const LossCell = styled(TableCell)`
  color: #e24a4a;
  font-weight: 600;
`;

const MapCell = styled(TableCell)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MapIcon = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 4px;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const FilterLabel = styled.label`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const FilterSelect = styled.select`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px 12px;
  color: #fff;
  font-size: 0.9rem;
  min-width: 150px;
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 20px;
  padding-right: 32px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }

  &:focus {
    outline: none;
    border-color: #4a90e2;
    background-color: rgba(255, 255, 255, 0.15);
  }

  option {
    background-color: #1a1a2e;
    color: #fff;
    padding: 8px;
  }
`;

const FilterInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px 12px;
  color: #fff;
  font-size: 0.9rem;
  min-width: 150px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const AnalyticsContainer = styled.div`
  margin-top: 40px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
`;

const AnalyticsTitle = styled.h2`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 20px 0;
`;

const PeriodSelector = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const PeriodButton = styled.button<{ active: boolean }>`
  background: ${props => props.active ? 'rgba(74, 144, 226, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.active ? '#4a90e2' : 'rgba(255, 255, 255, 0.2)'};
  color: ${props => props.active ? '#4a90e2' : 'rgba(255, 255, 255, 0.7)'};
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(74, 144, 226, 0.1);
    border-color: #4a90e2;
    color: #4a90e2;
  }
`;

const TrendsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const TrendCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 15px;
`;

const TrendTitle = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin-bottom: 10px;
`;

const TrendValue = styled.div<{ positive?: boolean; negative?: boolean }>`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => {
    if (props.positive) return '#4a90e2';
    if (props.negative) return '#e24a4a';
    return '#fff';
  }};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TrendArrow = styled.span<{ positive?: boolean }>`
  color: ${props => props.positive ? '#4a90e2' : '#e24a4a'};
  font-size: 1.2rem;
`;

const PerformanceCharts = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

interface ProfileData {
  username: string;
  rank: string;
  avatar: string;
  steamId: string;
  country?: string;
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  kdRatio: number;
  headshotPercentage: number;
  averageScore: number;
}

const Profile = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>({
    username: "vasichkaa",
    rank: "Supreme Master First Class",
    avatar: "https://avatars.steamstatic.com/76561198335870388_full.jpg",
    steamId: "STEAM_1:1:123456789",
    country: "Україна",
    matchesPlayed: 1250,
    matchesWon: 850,
    matchesLost: 400,
    kdRatio: 1.85,
    headshotPercentage: 72,
    averageScore: 28
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [filters, setFilters] = useState({
    map: 'all',
    result: 'all',
    minKd: '',
    maxKd: '',
    dateFrom: '',
    dateTo: ''
  });
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');

  // Дані для історії матчів
  const matchHistory = [
    {
      id: 1,
      map: 'Dust II',
      mapIcon: '/maps/dust2.png',
      result: 'win',
      score: '16-14',
      kd: '24-18',
      date: '2024-03-20 15:30',
    },
    {
      id: 2,
      map: 'Mirage',
      mapIcon: '/maps/mirage.png',
      result: 'loss',
      score: '12-16',
      kd: '18-22',
      date: '2024-03-20 14:15',
    },
    {
      id: 3,
      map: 'Inferno',
      mapIcon: '/maps/inferno.png',
      result: 'win',
      score: '16-8',
      kd: '26-15',
      date: '2024-03-20 13:00',
    },
    {
      id: 4,
      map: 'Nuke',
      mapIcon: '/maps/nuke.png',
      result: 'loss',
      score: '14-16',
      kd: '20-21',
      date: '2024-03-19 22:45',
    },
    {
      id: 5,
      map: 'Overpass',
      mapIcon: '/maps/overpass.png',
      result: 'win',
      score: '16-12',
      kd: '23-19',
      date: '2024-03-19 21:30',
    },
  ];

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredMatches = matchHistory.filter(match => {
    if (filters.map !== 'all' && match.map !== filters.map) return false;
    if (filters.result !== 'all' && match.result !== filters.result) return false;
    
    const [kills, deaths] = match.kd.split('-').map(Number);
    const kd = kills / deaths;
    
    if (filters.minKd && kd < Number(filters.minKd)) return false;
    if (filters.maxKd && kd > Number(filters.maxKd)) return false;
    
    const matchDate = new Date(match.date);
    if (filters.dateFrom && matchDate < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && matchDate > new Date(filters.dateTo)) return false;
    
    return true;
  });

  const fetchProfile = async () => {
    try {
      console.log('Початок завантаження профілю');
      const response = await fetch(API_ENDPOINTS.stats.profile, {
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          const token = localStorage.getItem('token');
          if (!token) {
            window.location.href = '/';
            return;
          }
          throw new Error('Будь ласка, увійдіть для перегляду профілю');
        }
        throw new Error(`Помилка отримання даних профілю: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Отримані дані профілю:', data);
      
      if (data) {
        setProfileData({
          ...data,
          rank: "Supreme Master First Class",
          matchesPlayed: 1250,
          matchesWon: 850,
          matchesLost: 400,
          kdRatio: 1.85,
          headshotPercentage: 72,
          averageScore: 28
        });
      }
    } catch (err) {
      console.error('Помилка отримання профілю:', err);
      setError(err instanceof Error ? err.message : 'Сталася помилка');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStats = async () => {
    setUpdating(true);
    try {
      await fetchProfile();
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    console.log('Початковий стан профілю:', profileData);
    fetchProfile();
  }, []);

  // Дані для графіків
  const matchHistoryData = [
    { name: 'Пн', перемоги: 4, поразки: 2, kdRatio: 1.8 },
    { name: 'Вт', перемоги: 3, поразки: 3, kdRatio: 1.2 },
    { name: 'Ср', перемоги: 5, поразки: 1, kdRatio: 2.1 },
    { name: 'Чт', перемоги: 2, поразки: 4, kdRatio: 0.9 },
    { name: 'Пт', перемоги: 6, поразки: 2, kdRatio: 1.9 },
    { name: 'Сб', перемоги: 4, поразки: 3, kdRatio: 1.5 },
    { name: 'Нд', перемоги: 3, поразки: 2, kdRatio: 1.7 },
  ];

  // Дані для трендів
  const trendsData = {
    week: {
      kdRatio: { value: 1.85, change: 0.15, positive: true },
      headshots: { value: 72, change: 5, positive: true },
      winRate: { value: 68, change: -2, positive: false },
      averageScore: { value: 28, change: 3, positive: true }
    },
    month: {
      kdRatio: { value: 1.75, change: 0.25, positive: true },
      headshots: { value: 68, change: 8, positive: true },
      winRate: { value: 65, change: 5, positive: true },
      averageScore: { value: 25, change: 4, positive: true }
    }
  };

  // Дані для графіків продуктивності
  const performanceData = {
    week: [
      { date: 'Пн', kd: 1.8, headshots: 70, score: 25, перемоги: 4, поразки: 2 },
      { date: 'Вт', kd: 1.9, headshots: 75, score: 28, перемоги: 3, поразки: 3 },
      { date: 'Ср', kd: 1.7, headshots: 68, score: 24, перемоги: 5, поразки: 1 },
      { date: 'Чт', kd: 2.0, headshots: 80, score: 30, перемоги: 2, поразки: 4 },
      { date: 'Пт', kd: 1.8, headshots: 72, score: 26, перемоги: 6, поразки: 2 },
      { date: 'Сб', kd: 1.9, headshots: 74, score: 27, перемоги: 4, поразки: 3 },
      { date: 'Нд', kd: 1.85, headshots: 73, score: 28, перемоги: 3, поразки: 2 }
    ],
    month: [
      { date: '1', kd: 1.75, headshots: 68, score: 24, перемоги: 5, поразки: 3 },
      { date: '5', kd: 1.82, headshots: 71, score: 26, перемоги: 6, поразки: 2 },
      { date: '10', kd: 1.78, headshots: 69, score: 25, перемоги: 4, поразки: 3 },
      { date: '15', kd: 1.85, headshots: 73, score: 27, перемоги: 5, поразки: 2 },
      { date: '20', kd: 1.90, headshots: 75, score: 28, перемоги: 7, поразки: 1 },
      { date: '25', kd: 1.88, headshots: 74, score: 27, перемоги: 6, поразки: 2 },
      { date: '30', kd: 1.92, headshots: 76, score: 29, перемоги: 8, поразки: 1 }
    ]
  };

  const weaponStatsData = [
    { name: 'AK-47', вбивства: 450 },
    { name: 'M4A4', вбивства: 380 },
    { name: 'AWP', вбивства: 320 },
    { name: 'USP-S', вбивства: 150 },
    { name: 'Glock', вбивства: 120 },
  ];

  const mapStatsData = [
    { name: 'Dust II', value: 35 },
    { name: 'Mirage', value: 25 },
    { name: 'Inferno', value: 20 },
    { name: 'Nuke', value: 15 },
    { name: 'Overpass', value: 5 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (loading) {
    return (
      <Container>
        <LoadingMessage>Завантаження даних профілю...</LoadingMessage>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }

  if (!profileData) {
    console.log('Профіль порожній');
    return null;
  }

  console.log('Рендеримо профіль з даними:', profileData);

  return (
    <Container>
      <ProfileCard>
        <PortfolioHeader>
          <Avatar src={profileData.avatar} alt={profileData.username} />
          <UserInfo>
            <Username>{profileData.username}</Username>
            <Rank>{profileData.rank}</Rank>
            <SteamId>
              <span>Steam ID:</span>
              <span>{profileData.steamId}</span>
            </SteamId>
            {profileData.country && (
              <Country>
                <span>Країна:</span>
                <span>{profileData.country}</span>
              </Country>
            )}
          </UserInfo>
          <UpdateButton onClick={handleUpdateStats} disabled={updating}>
            {updating ? 'Оновлення...' : 'Оновити статистику'}
          </UpdateButton>
        </PortfolioHeader>

        <StatsGrid>
          <StatCard>
            <StatTitle>Зіграно матчів</StatTitle>
            <StatValue>{profileData.matchesPlayed}</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Виграно матчів</StatTitle>
            <StatValue>{profileData.matchesWon}</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Програно матчів</StatTitle>
            <StatValue>{profileData.matchesLost}</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>K/D Ratio</StatTitle>
            <StatValue>{profileData.kdRatio.toFixed(2)}</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Відсоток хедшотів</StatTitle>
            <StatValue>{profileData.headshotPercentage}%</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Середній рахунок</StatTitle>
            <StatValue>{profileData.averageScore}</StatValue>
          </StatCard>
        </StatsGrid>

        <ChartsContainer>
          <ChartCard>
            <ChartTitle>Історія матчів за тиждень</ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData[selectedPeriod]}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="перемоги" fill="#4a90e2" name="Перемоги" />
                <Bar dataKey="поразки" fill="#e24a4a" name="Поразки" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard>
            <ChartTitle>Статистика по зброї</ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weaponStatsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="вбивства" fill="#4a90e2" name="Вбивства" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard>
            <ChartTitle>Розподіл по картах</ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mapStatsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mapStatsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard>
            <ChartTitle>Тренд K/D Ratio</ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData[selectedPeriod]}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="kd" 
                  stroke="#4a90e2" 
                  name="K/D Ratio"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </ChartsContainer>

        <AnalyticsContainer>
          <AnalyticsTitle>Аналітика продуктивності</AnalyticsTitle>
          
          <PeriodSelector>
            <PeriodButton 
              active={selectedPeriod === 'week'} 
              onClick={() => setSelectedPeriod('week')}
            >
              7 днів
            </PeriodButton>
            <PeriodButton 
              active={selectedPeriod === 'month'} 
              onClick={() => setSelectedPeriod('month')}
            >
              Місяць
            </PeriodButton>
          </PeriodSelector>

          <TrendsGrid>
            <TrendCard>
              <TrendTitle>K/D Ratio</TrendTitle>
              <TrendValue positive={trendsData[selectedPeriod].kdRatio.positive}>
                {trendsData[selectedPeriod].kdRatio.value}
                <TrendArrow positive={trendsData[selectedPeriod].kdRatio.positive}>
                  {trendsData[selectedPeriod].kdRatio.positive ? '↑' : '↓'}
                </TrendArrow>
                {trendsData[selectedPeriod].kdRatio.change}
              </TrendValue>
            </TrendCard>
            <TrendCard>
              <TrendTitle>Відсоток хедшотів</TrendTitle>
              <TrendValue positive={trendsData[selectedPeriod].headshots.positive}>
                {trendsData[selectedPeriod].headshots.value}%
                <TrendArrow positive={trendsData[selectedPeriod].headshots.positive}>
                  {trendsData[selectedPeriod].headshots.positive ? '↑' : '↓'}
                </TrendArrow>
                {trendsData[selectedPeriod].headshots.change}%
              </TrendValue>
            </TrendCard>
            <TrendCard>
              <TrendTitle>Відсоток перемог</TrendTitle>
              <TrendValue positive={trendsData[selectedPeriod].winRate.positive}>
                {trendsData[selectedPeriod].winRate.value}%
                <TrendArrow positive={trendsData[selectedPeriod].winRate.positive}>
                  {trendsData[selectedPeriod].winRate.positive ? '↑' : '↓'}
                </TrendArrow>
                {trendsData[selectedPeriod].winRate.change}%
              </TrendValue>
            </TrendCard>
            <TrendCard>
              <TrendTitle>Середній рахунок</TrendTitle>
              <TrendValue positive={trendsData[selectedPeriod].averageScore.positive}>
                {trendsData[selectedPeriod].averageScore.value}
                <TrendArrow positive={trendsData[selectedPeriod].averageScore.positive}>
                  {trendsData[selectedPeriod].averageScore.positive ? '↑' : '↓'}
                </TrendArrow>
                {trendsData[selectedPeriod].averageScore.change}
              </TrendValue>
            </TrendCard>
          </TrendsGrid>

          <PerformanceCharts>
            <ChartCard>
              <ChartTitle>Тренд K/D Ratio</ChartTitle>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData[selectedPeriod]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.7)" />
                  <YAxis stroke="rgba(255,255,255,0.7)" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="kd" 
                    stroke="#4a90e2" 
                    name="K/D Ratio"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard>
              <ChartTitle>Тренд хедшотів</ChartTitle>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData[selectedPeriod]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.7)" />
                  <YAxis stroke="rgba(255,255,255,0.7)" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="headshots" 
                    stroke="#00C49F" 
                    name="Хедшоти %"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard>
              <ChartTitle>Тренд рахунку</ChartTitle>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData[selectedPeriod]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.7)" />
                  <YAxis stroke="rgba(255,255,255,0.7)" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#FFBB28" 
                    name="Рахунок"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </PerformanceCharts>
        </AnalyticsContainer>

        <MatchHistoryContainer>
          <MatchHistoryHeader>
            <div>
              <MatchHistoryTitle>Історія матчів</MatchHistoryTitle>
              <MatchStats>
                <MatchCount>
                  <span>Всього матчів:</span>
                  <MatchCountValue>{profileData.matchesPlayed}</MatchCountValue>
                </MatchCount>
                <MatchCount>
                  <span>Перемоги:</span>
                  <MatchCountValue style={{ color: '#4a90e2' }}>{profileData.matchesWon}</MatchCountValue>
                </MatchCount>
                <MatchCount>
                  <span>Поразки:</span>
                  <MatchCountValue style={{ color: '#e24a4a' }}>{profileData.matchesLost}</MatchCountValue>
                </MatchCount>
              </MatchStats>
            </div>
            <UpdateMatchButton onClick={handleUpdateStats} disabled={updating}>
              {updating ? 'Оновлення...' : 'Оновити матчі'}
            </UpdateMatchButton>
          </MatchHistoryHeader>

          <FiltersContainer>
            <FilterGroup>
              <FilterLabel>Карта</FilterLabel>
              <FilterSelect 
                name="map" 
                value={filters.map} 
                onChange={handleFilterChange}
              >
                <option value="all">Всі карти</option>
                <option value="Dust II">Dust II</option>
                <option value="Mirage">Mirage</option>
                <option value="Inferno">Inferno</option>
                <option value="Nuke">Nuke</option>
                <option value="Overpass">Overpass</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Результат</FilterLabel>
              <FilterSelect 
                name="result" 
                value={filters.result} 
                onChange={handleFilterChange}
              >
                <option value="all">Всі результати</option>
                <option value="win">Перемоги</option>
                <option value="loss">Поразки</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Мін. K/D</FilterLabel>
              <FilterInput 
                type="number" 
                name="minKd" 
                value={filters.minKd} 
                onChange={handleFilterChange}
                placeholder="0.0"
                step="0.1"
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Макс. K/D</FilterLabel>
              <FilterInput 
                type="number" 
                name="maxKd" 
                value={filters.maxKd} 
                onChange={handleFilterChange}
                placeholder="5.0"
                step="0.1"
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Від дати</FilterLabel>
              <FilterInput 
                type="date" 
                name="dateFrom" 
                value={filters.dateFrom} 
                onChange={handleFilterChange}
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>До дати</FilterLabel>
              <FilterInput 
                type="date" 
                name="dateTo" 
                value={filters.dateTo} 
                onChange={handleFilterChange}
              />
            </FilterGroup>
          </FiltersContainer>

          <MatchTable>
            <thead>
              <tr>
                <TableHeader>Карта</TableHeader>
                <TableHeader>Результат</TableHeader>
                <TableHeader>Рахунок</TableHeader>
                <TableHeader>K/D</TableHeader>
                <TableHeader>Дата</TableHeader>
              </tr>
            </thead>
            <tbody>
              {filteredMatches.map((match) => (
                <TableRow key={match.id}>
                  <MapCell>
                    <MapIcon src={match.mapIcon} alt={match.map} />
                    {match.map}
                  </MapCell>
                  {match.result === 'win' ? (
                    <WinCell>Перемога</WinCell>
                  ) : (
                    <LossCell>Поразка</LossCell>
                  )}
                  <TableCell>{match.score}</TableCell>
                  <TableCell>{match.kd}</TableCell>
                  <TableCell>{match.date}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </MatchTable>
        </MatchHistoryContainer>
      </ProfileCard>
    </Container>
  );
};

export default Profile; 