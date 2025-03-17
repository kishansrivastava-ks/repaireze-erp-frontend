import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addStaff } from "@/utils/api";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Container = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadows.md};
  max-width: 400px;
  margin: auto;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.muted};
  border-radius: 5px;
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 0.8rem;
  border: none;
  cursor: pointer;
`;

const AddStaff = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.userType !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  const mutation = useMutation({
    mutationFn: addStaff,
    onSuccess: () => {
      queryClient.invalidateQueries(["staffs"]); // ✅ Update staff list
      alert("Staff added successfully!");
      reset();
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <Container>
      <Title>Add New Staff</Title>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input {...register("name")} placeholder="Name" required />
        <Input {...register("phone")} placeholder="Phone" required />
        <Input {...register("address")} placeholder="Address" required />
        <Input
          {...register("alternatePhone")}
          placeholder="Alternate Phone"
          required
        />
        <Input {...register("staffRole")} placeholder="Staff Role" required />
        <Input
          {...register("password")}
          type="password"
          placeholder="Password"
          required
        />
        <Input
          {...register("pin")}
          type="password"
          placeholder="4-digit PIN"
          required
        />
        <Button type="submit">Add Staff</Button>
      </Form>
    </Container>
  );
};

export default AddStaff;
