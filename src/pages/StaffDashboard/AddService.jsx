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

const AddService = () => {
  return (
    <Container>
      <Title>Add Service</Title>
      <p>This page will allow staff to add services.</p>
    </Container>
  );
};

export default AddService;
