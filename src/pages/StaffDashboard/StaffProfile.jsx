import { useAuth } from "@/context/AuthContext";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Card container with refined styling
const ProfileCard = styled(motion.div)`
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

// Header section styling
const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.muted || "#6c757d"};
  font-size: 0.9rem;
  margin: 0;
`;

// Profile avatar
const AvatarContainer = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: ${({ theme }) =>
    `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`};
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const AvatarInitial = styled.span`
  color: white;
  font-size: 2.5rem;
  font-weight: 500;
`;

// Profile info section
const InfoSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  text-align: left;
`;

const InfoItem = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.backgroundLight || "#f8f9fa"};
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }
`;

const InfoLabel = styled.span`
  display: block;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.muted || "#6c757d"};
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.span`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text || "#212529"};
  font-weight: 500;
`;

// Shimmer loading effect
const ShimmerContainer = styled.div`
  position: relative;
  overflow: hidden;
  background: #f6f7f8;
  height: ${(props) => props.height || "1rem"};
  border-radius: 4px;
  margin-bottom: ${(props) => props.mb || "0"};

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
`;

const StaffProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  console.log("printing user details", user);
  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Get user's initial for avatar
  const getInitial = () => {
    if (!user?.name) return "M";
    return user.name.charAt(0).toUpperCase();
  };

  // Animations
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (custom) => ({
      opacity: 1,
      x: 0,
      transition: { delay: custom * 0.1, duration: 0.3 },
    }),
  };

  if (loading) {
    return (
      <ProfileCard
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Header>
          <ShimmerContainer
            height="100px"
            mb="1.5rem"
            style={{
              width: "100px",
              borderRadius: "50%",
              margin: "0 auto 1.5rem",
            }}
          />
          <ShimmerContainer
            height="1.75rem"
            mb="0.5rem"
            style={{ width: "50%", margin: "0 auto" }}
          />
          <ShimmerContainer
            height="0.9rem"
            style={{ width: "30%", margin: "0 auto" }}
          />
        </Header>
        <InfoSection>
          {[1, 2, 3, 4].map((i) => (
            <ShimmerContainer key={i} height="3.25rem" />
          ))}
        </InfoSection>
      </ProfileCard>
    );
  }

  return (
    <ProfileCard
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Header>
        <AvatarContainer>
          <AvatarInitial>{getInitial()}</AvatarInitial>
        </AvatarContainer>
        <Title>Staff Profile</Title>
        <Subtitle>Mendt Technologies Private Limited</Subtitle>
      </Header>

      <InfoSection>
        <motion.div custom={0} variants={itemVariants}>
          <InfoItem>
            <InfoLabel>Full Name</InfoLabel>
            <InfoValue>{user?.name || "Not Available"}</InfoValue>
          </InfoItem>
        </motion.div>

        <motion.div custom={1} variants={itemVariants}>
          <InfoItem>
            <InfoLabel>Phone Number</InfoLabel>
            <InfoValue>{user?.phone || "Not Available"}</InfoValue>
          </InfoItem>
        </motion.div>

        <motion.div custom={2} variants={itemVariants}>
          <InfoItem>
            <InfoLabel>Role</InfoLabel>
            <InfoValue>{user?.staffRole || "Not Available"}</InfoValue>
          </InfoItem>
        </motion.div>

        <motion.div custom={3} variants={itemVariants}>
          <InfoItem>
            <InfoLabel>Address</InfoLabel>
            <InfoValue>{user?.address || "Not Available"}</InfoValue>
          </InfoItem>
        </motion.div>
      </InfoSection>
    </ProfileCard>
  );
};

export default StaffProfile;
