import { useAuth } from "../context/AuthContext";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.light};
`;

const Card = styled.div`
  padding: ${({ theme }) => theme.space.xl};
  background: white;
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  text-align: center;
  max-width: 400px;
  width: 100%;
`;

const Title = styled.h2`
  margin-bottom: ${({ theme }) => theme.space.md};
  color: ${({ theme }) => theme.colors.primary};
`;

const Info = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <Container>
      <Card>
        <Title>Admin Dashboard</Title>
        <Info>Name: {user?.name}</Info>
        <Info>Phone: {user?.phone}</Info>
        <Info>Role: {user?.userType}</Info>
      </Card>
    </Container>
  );
};

export default AdminDashboard;
