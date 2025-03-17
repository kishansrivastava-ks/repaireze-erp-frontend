import { useAuth } from "@/context/AuthContext";
import styled from "styled-components";

const Container = styled.div`
  text-align: center;
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
`;

const Info = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: bold;
`;

const AdminProfile = () => {
  const { user } = useAuth();

  return (
    <Container>
      <Title>Admin Profile</Title>
      <Info>Name: {user?.name}</Info>
      <Info>Phone: {user?.phone}</Info>
      <Info>Role: {user?.userType}</Info>
    </Container>
  );
};

export default AdminProfile;
