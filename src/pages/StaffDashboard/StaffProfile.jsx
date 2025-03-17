import { useAuth } from "@/context/AuthContext";
import styled from "styled-components";

const Container = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadows.md};
  text-align: center;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.secondary};
`;

const Info = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: bold;
`;

const StaffProfile = () => {
  const { user } = useAuth();

  return (
    <Container>
      <Title>Staff Profile</Title>
      <Info>Name: {user?.name}</Info>
      <Info>Phone: {user?.phone}</Info>
      <Info>Role: {user?.staffRole}</Info>
      <Info>Address: {user?.address}</Info>
    </Container>
  );
};

export default StaffProfile;
