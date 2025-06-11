import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { API_ENDPOINTS, getAuthHeader } from '../config/api';
import { formatDate } from '../utils/date';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%);
  padding: 100px 20px 40px;
`;

const MatchesCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const MatchesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const MatchesTitle = styled.h2`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0;
`;

const PageDescription = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0 30px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }
`;

const DescriptionText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const MatchCountBadge = styled.span`
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 600;
  color: white;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.2);
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

const MatchStats = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 20px;
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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
`;

const PageButton = styled.button<{ active?: boolean }>`
  background: ${props => props.active ? 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${props => props.active ? '#fff' : 'rgba(255, 255, 255, 0.7)'};
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)' : 'rgba(255, 255, 255, 0.15)'};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const MatchCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 40px;
`;

const MatchCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }
`;

const MatchCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
`;

const MatchCardMapIcon = styled.img`
  width: 120px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const MatchCardMapInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const MatchCardMapName = styled.div`
  color: #fff;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MatchCardDate = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
`;

const MatchCardResult = styled.div<{ result: 'win' | 'loss' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.result === 'win' ? '#4a90e2' : '#e24a4a'};
  font-weight: 600;
  font-size: 1.2rem;
  white-space: nowrap;
`;

const MatchCardStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin: 20px 0;
  padding: 15px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  text-transform: uppercase;
`;

const StatValue = styled.div`
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
`;

const MatchCardButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(74, 144, 226, 0.3);
  }
`;

const ChartsSection = styled.div`
  margin-top: 40px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
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

interface MatchData {
  id: number;
  map: string;
  mapIcon: string;
  result: 'win' | 'loss';
  score: string;
  kd: string;
  date: string;
}

interface MatchStats {
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
}

const Matches = () => {
  const navigate = useNavigate();
  
  // Генеруємо 1250 матчів
  const generateMatches = (): MatchData[] => {
    const maps = ['Dust II', 'Mirage', 'Inferno', 'Nuke', 'Overpass'];
    const matches: MatchData[] = [];
    const totalMatches = 1250;
    const wins = 850;
    const losses = totalMatches - wins;

    // Генеруємо перемоги
    for (let i = 0; i < wins; i++) {
      const map = maps[Math.floor(Math.random() * maps.length)];
      const score = `16-${Math.floor(Math.random() * 14)}`;
      const kills = Math.floor(Math.random() * 20) + 15;
      const deaths = Math.floor(Math.random() * 15) + 10;
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      date.setHours(Math.floor(Math.random() * 24));
      date.setMinutes(Math.floor(Math.random() * 60));

      matches.push({
        id: i + 1,
        map,
        mapIcon: `/maps/${map.toLowerCase().replace(' ', '')}.png`,
        result: 'win',
        score,
        kd: `${kills}-${deaths}`,
        date: date.toLocaleString('uk-UA')
      });
    }

    // Генеруємо поразки
    for (let i = 0; i < losses; i++) {
      const map = maps[Math.floor(Math.random() * maps.length)];
      const score = `${Math.floor(Math.random() * 14)}-16`;
      const kills = Math.floor(Math.random() * 15) + 10;
      const deaths = Math.floor(Math.random() * 20) + 15;
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      date.setHours(Math.floor(Math.random() * 24));
      date.setMinutes(Math.floor(Math.random() * 60));

      matches.push({
        id: wins + i + 1,
        map,
        mapIcon: `/maps/${map.toLowerCase().replace(' ', '')}.png`,
        result: 'loss',
        score,
        kd: `${kills}-${deaths}`,
        date: date.toLocaleString('uk-UA')
      });
    }

    // Сортуємо за датою (від нових до старих)
    return matches.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const initialMatches = generateMatches();
  const [matches, setMatches] = useState<MatchData[]>(initialMatches);
  const [stats, setStats] = useState<MatchStats>({
    matchesPlayed: 0,
    matchesWon: 0,
    matchesLost: 0
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

  const [currentPage, setCurrentPage] = useState(1);
  const matchesPerPage = 10;
  const totalPages = Math.ceil(matches.length / matchesPerPage);

  const paginatedMatches = matches.slice(
    (currentPage - 1) * matchesPerPage,
    currentPage * matchesPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const fetchMatches = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch(API_ENDPOINTS.stats.matches, {
      //   headers: getAuthHeader(),
      // });
      // if (!response.ok) {
      //   throw new Error('Помилка отримання даних матчів');
      // }
      // const data = await response.json();
      // setMatches(data.matches);
      
      // Temporary mock data
      setMatches(initialMatches);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Сталася помилка');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStats = async () => {
    setUpdating(true);
    try {
      await fetchMatches();
    } finally {
      setUpdating(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredMatches = matches.filter(match => {
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

  useEffect(() => {
    fetchMatches();
  }, []);

  if (loading) {
    return (
      <Container>
        <LoadingMessage>Завантаження матчів...</LoadingMessage>
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

  const generateMatchCards = () => {
    const matchesToShow = paginatedMatches.slice(0, 6);
    
    return matchesToShow.map(match => {
      const [kills, deaths] = match.kd.split('-').map(Number);
      const kd = (kills / deaths).toFixed(2);
      const headshots = Math.floor(Math.random() * 30) + 50;
      const rating = (Math.random() * 1.5 + 0.5).toFixed(2);

      // Використовуємо локальні зображення мап
      const mapImages = {
        'Dust II': '/images/maps/dust2.jpg',
        'Mirage': '/images/maps/mirage.jpg',
        'Inferno': '/images/maps/inferno.jpg',
        'Nuke': '/images/maps/nuke.jpg',
        'Overpass': '/images/maps/overpass.jpg'
      };

      // Додаємо обробку помилок завантаження зображень
      const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.target as HTMLImageElement;
        target.src = '/images/maps/default.jpg';
      };

      return (
        <MatchCard key={match.id}>
          <MatchCardHeader>
            <MatchCardMapIcon 
              src={mapImages[match.map as keyof typeof mapImages]} 
              alt={match.map}
              onError={handleImageError}
            />
            <MatchCardMapInfo>
              <MatchCardMapName>{match.map}</MatchCardMapName>
              <MatchCardDate>{match.date}</MatchCardDate>
            </MatchCardMapInfo>
            <MatchCardResult result={match.result}>
              {match.result === 'win' ? '🟢 Win' : '🔴 Loss'}
            </MatchCardResult>
          </MatchCardHeader>
          <MatchCardStats>
            <StatItem>
              <StatLabel>Kills</StatLabel>
              <StatValue>{kills}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>K/D</StatLabel>
              <StatValue>{kd}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>HS%</StatLabel>
              <StatValue>{headshots}%</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Rating</StatLabel>
              <StatValue>{rating}</StatValue>
            </StatItem>
          </MatchCardStats>
          <MatchCardButton>Детальніше</MatchCardButton>
        </MatchCard>
      );
    });
  };

  const generatePerformanceData = () => {
    // Беремо останні 20 матчів для графіка
    const recentMatches = matches.slice(0, 20).reverse();
    
    return recentMatches.map(match => {
      const [kills, deaths] = match.kd.split('-').map(Number);
      const kd = kills / deaths;
      const rating = (Math.random() * 1.5 + 0.5).toFixed(2); // Імітуємо рейтинг
      
      return {
        match: `Match ${match.id}`,
        kd: parseFloat(kd.toFixed(2)),
        rating: parseFloat(rating)
      };
    });
  };

  const generateMapDistributionData = () => {
    const mapCounts = matches.reduce((acc, match) => {
      acc[match.map] = (acc[match.map] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(mapCounts).map(([map, count]) => ({
      name: map,
      value: count
    }));
  };

  const generateWinLossData = () => {
    const wins = matches.filter(match => match.result === 'win').length;
    const losses = matches.filter(match => match.result === 'loss').length;

    return [
      { name: 'Перемоги', value: wins },
      { name: 'Поразки', value: losses }
    ];
  };

  const COLORS = ['#4a90e2', '#e24a4a'];

  return (
    <Container>
      <MatchesCard>
        <MatchesHeader>
          <div>
            <MatchesTitle>Історія матчів</MatchesTitle>
            <PageDescription>
              <DescriptionText>
                <span>На цій сторінці ви можете переглянути історію всіх ваших матчів у CS:GO.</span>
                <MatchCountBadge>{matches.length} матчів</MatchCountBadge>
              </DescriptionText>
              <DescriptionText style={{ marginTop: '10px', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                Використовуйте фільтри для пошуку конкретних матчів та кнопку "Оновити матчі" для синхронізації з вашим профілем.
              </DescriptionText>
            </PageDescription>
            <MatchStats>
              <MatchCount>
                <span>Всього матчів:</span>
                <MatchCountValue>{matches.length}</MatchCountValue>
              </MatchCount>
              <MatchCount>
                <span>Перемоги:</span>
                <MatchCountValue style={{ color: '#4a90e2' }}>{matches.filter(m => m.result === 'win').length}</MatchCountValue>
              </MatchCount>
              <MatchCount>
                <span>Поразки:</span>
                <MatchCountValue style={{ color: '#e24a4a' }}>{matches.filter(m => m.result === 'loss').length}</MatchCountValue>
              </MatchCount>
            </MatchStats>
          </div>
          <UpdateMatchButton onClick={handleUpdateStats} disabled={updating}>
            {updating ? 'Оновлення...' : 'Оновити матчі'}
          </UpdateMatchButton>
        </MatchesHeader>

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
            {paginatedMatches.map((match) => (
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

        <PaginationContainer>
          <PageButton 
            onClick={() => handlePageChange(1)} 
            disabled={currentPage === 1}
          >
            &laquo;
          </PageButton>
          <PageButton 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1}
          >
            &lsaquo;
          </PageButton>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNumber = i + 1;
            return (
              <PageButton
                key={pageNumber}
                active={currentPage === pageNumber}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </PageButton>
            );
          })}

          <PageButton 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
          >
            &rsaquo;
          </PageButton>
          <PageButton 
            onClick={() => handlePageChange(totalPages)} 
            disabled={currentPage === totalPages}
          >
            &raquo;
          </PageButton>
        </PaginationContainer>

        <MatchCardsContainer>
          {generateMatchCards()}
        </MatchCardsContainer>

        <ChartsSection>
          <ChartCard>
            <ChartTitle>Рейтинг та K/D за останні 20 матчів</ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={generatePerformanceData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="match" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="rating" 
                  stroke="#4a90e2" 
                  name="Рейтинг"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="kd" 
                  stroke="#00C49F" 
                  name="K/D"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard>
            <ChartTitle>Розподіл матчів по картах</ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={generateMapDistributionData()}>
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
                <Bar dataKey="value" fill="#4a90e2" name="Кількість матчів" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard>
            <ChartTitle>Співвідношення перемог/поразок</ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={generateWinLossData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {generateWinLossData().map((entry, index) => (
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
        </ChartsSection>
      </MatchesCard>
    </Container>
  );
};

export default Matches; 