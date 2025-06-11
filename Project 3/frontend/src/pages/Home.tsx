import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend
);

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  padding: 80px 2rem 2rem;
  color: #fff;
`;

const Hero = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  padding: 4rem 0;
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  background: linear-gradient(45deg, #fff 30%, #00ff88 90%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 3rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 4rem auto;
  padding: 0 1rem;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #00ff88;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #fff;
`;

const FeatureDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
`;

const CTAButton = styled.button`
  background: linear-gradient(45deg, #00ff88 30%, #00cc6a 90%);
  color: #000;
  border: none;
  padding: 1rem 3rem;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 255, 136, 0.3);
  }
`;

const MockupSection = styled.div`
  max-width: 1200px;
  margin: 4rem auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const MockupTitle = styled.h2`
  font-size: 2rem;
  color: #fff;
  margin-bottom: 2rem;
  text-align: center;
`;

const MockupGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const MockupCard = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 0.5rem;
  padding: 1.5rem;
  height: 100%;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 300px;
  background: url('/map-mockup.jpg') center/cover;
  border-radius: 0.5rem;
  position: relative;
  margin-bottom: 1rem;
`;

const PlayerDot = styled.div<{ x: number; y: number; team: 't' | 'ct' }>`
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.team === 't' ? '#ff4444' : '#4444ff'};
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px ${props => props.team === 't' ? '#ff4444' : '#4444ff'};
`;

const RoundStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1rem;
`;

const RoundStat = styled.div`
  text-align: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #00ff88;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
`;

const Home: React.FC = () => {
  const navigate = useNavigate();

  const kdData = {
    labels: ['Матч 1', 'Матч 2', 'Матч 3', 'Матч 4', 'Матч 5'],
    datasets: [
      {
        label: 'K/D Ratio',
        data: [1.2, 1.5, 1.3, 1.8, 1.6],
        borderColor: '#00ff88',
        backgroundColor: 'rgba(0, 255, 136, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#fff',
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#fff',
        },
      },
    },
  };

  return (
    <Container>
      <Hero>
        <Title>Відстежуйте свій шлях у CS2</Title>
        <Subtitle>
          Аналізуйте свою гру, відстежуйте прогрес і ставайте кращим гравцем завдяки нашій комплексній платформі статистики CS2.
        </Subtitle>
        <CTAButton onClick={() => navigate('/register')}>
          Почати
        </CTAButton>
      </Hero>

      <MockupSection>
        <MockupTitle>Статистика матчу в реальному часі</MockupTitle>
        <MockupGrid>
          <MockupCard>
            <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Тенденція K/D Ratio</h3>
            <Line data={kdData} options={chartOptions} />
          </MockupCard>
          
          <MockupCard>
            <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Позиції гравців</h3>
            <MapContainer>
              <PlayerDot x={30} y={40} team="t" />
              <PlayerDot x={45} y={35} team="t" />
              <PlayerDot x={60} y={50} team="ct" />
              <PlayerDot x={70} y={45} team="ct" />
            </MapContainer>
            <RoundStats>
              <RoundStat>
                <StatValue>13</StatValue>
                <StatLabel>Виграних раундів</StatLabel>
              </RoundStat>
              <RoundStat>
                <StatValue>1.5</StatValue>
                <StatLabel>K/D Ratio</StatLabel>
              </RoundStat>
              <RoundStat>
                <StatValue>85%</StatValue>
                <StatLabel>Відсоток хедшотів</StatLabel>
              </RoundStat>
            </RoundStats>
          </MockupCard>
        </MockupGrid>
      </MockupSection>

      <Features>
        <FeatureCard>
          <FeatureIcon>📊</FeatureIcon>
          <FeatureTitle>Детальна аналітика</FeatureTitle>
          <FeatureDescription>
            Отримуйте комплексні дані про вашу гру з розширеною статистикою та метриками продуктивності.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>🎯</FeatureIcon>
          <FeatureTitle>Історія матчів</FeatureTitle>
          <FeatureDescription>
            Відстежуйте свої матчі, аналізуйте продуктивність та визначайте сфери для покращення.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>📈</FeatureIcon>
          <FeatureTitle>Відстеження прогресу</FeatureTitle>
          <FeatureDescription>
            Спостерігайте за своїм покращенням з часом завдяки детальному відстеженню прогресу та тенденцій продуктивності.
          </FeatureDescription>
        </FeatureCard>
      </Features>
    </Container>
  );
};

export default Home; 