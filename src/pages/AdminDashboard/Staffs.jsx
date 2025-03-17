import { useQuery } from "@tanstack/react-query";
import { fetchStaffs } from "@/utils/api";
import styled from "styled-components";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Container = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
`;

const StaffCard = styled.div`
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.muted};
  border-radius: 5px;
  margin-bottom: 10px;
`;

const Staffs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    data: staffs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["staffs"],
    queryFn: fetchStaffs,
  });

  useEffect(() => {
    if (!user || user.userType !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  if (isLoading) return <p>Loading staffs...</p>;
  if (error) return <p>Error fetching staffs: {error.message}</p>;

  return (
    <Container>
      <Title>Staff Members</Title>
      {staffs?.map((staff) => (
        <StaffCard key={staff._id}>
          <p>
            <strong>Name:</strong> {staff.name}
          </p>
          <p>
            <strong>Phone:</strong> {staff.phone}
          </p>
          <p>
            <strong>Role:</strong> {staff.staffRole}
          </p>
        </StaffCard>
      ))}
    </Container>
  );
};

export default Staffs;
