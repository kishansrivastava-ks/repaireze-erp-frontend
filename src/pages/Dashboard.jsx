import { motion } from "framer-motion";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";

const DashboardContainer = styled(motion.div)`
  padding: ${({ theme }) => theme.space.lg};
`;

const WelcomeSection = styled.div`
  margin-bottom: ${({ theme }) => theme.space.xl};
`;

const Title = styled.h1`
  margin-bottom: ${({ theme }) => theme.space.sm};
  color: ${({ theme }) => theme.colors.dark};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.muted};
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.space.lg};
  margin-bottom: ${({ theme }) => theme.space.xl};
`;

const StatCard = styled(motion.div)`
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.space.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const StatTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.space.xs};
  color: ${({ theme }) => theme.colors.muted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  text-transform: uppercase;
`;

const StatValue = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xxxl};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.dark};
  margin: 0;
`;

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <WelcomeSection>
        <Title>Welcome back, {user?.name || "User"}</Title>
        <Subtitle>Here's what's happening today</Subtitle>
      </WelcomeSection>

      <StatsSection>
        <StatCard
          whileHover={{ y: -5, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}
          transition={{ duration: 0.2 }}
        >
          <StatTitle>Pending Repairs</StatTitle>
          <StatValue>24</StatValue>
        </StatCard>

        <StatCard
          whileHover={{ y: -5, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}
          transition={{ duration: 0.2 }}
        >
          <StatTitle>Active Technicians</StatTitle>
          <StatValue>8</StatValue>
        </StatCard>

        <StatCard
          whileHover={{ y: -5, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}
          transition={{ duration: 0.2 }}
        >
          <StatTitle>Completed Today</StatTitle>
          <StatValue>12</StatValue>
        </StatCard>

        <StatCard
          whileHover={{ y: -5, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}
          transition={{ duration: 0.2 }}
        >
          <StatTitle>Customer Satisfaction</StatTitle>
          <StatValue>94%</StatValue>
        </StatCard>
      </StatsSection>
    </DashboardContainer>
  );
};

export default Dashboard;
