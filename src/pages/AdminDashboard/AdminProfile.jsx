import { useAuth } from "@/context/AuthContext";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  /* border: 2px solid red; */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
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

const AdminProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

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

  return (
    <ProfileCard
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Header>
        {/* <Title>Admin Profile</Title> */}
        {/* display the first letter of the user */}
        <UserCircle>{user.name.charAt(0).toUpperCase()}</UserCircle>
        <Subtitle>Administrator Account</Subtitle>
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
            <InfoValue>{user?.userType || "Not Available"}</InfoValue>
          </InfoItem>
        </motion.div>
      </InfoSection>
    </ProfileCard>
  );
};

export default AdminProfile;

const UserCircle = styled.div`
  height: 50px;
  width: 50px;
  font-size: 1.5rem;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
