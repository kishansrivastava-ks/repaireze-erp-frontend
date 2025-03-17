/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/authService";

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

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.space.sm};
  border: 1px solid ${({ theme }) => theme.colors.muted};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.fontSizes.md};
  text-align: center;
  font-weight: bold;
  letter-spacing: 3px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.space.md};
  margin-top: ${({ theme }) => theme.space.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0051b3;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.muted};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: ${({ theme }) => theme.space.xs};
`;

const VerifyPin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const verifyPinMutation = useMutation({
    mutationFn: async (pin) => {
      return await authService.verifyPin({ pin });
    },
    onSuccess: (responseData) => {
      if (responseData.verified) {
        queryClient.setQueryData(["authUser"], responseData);
        alert("Login successful!");
        navigate("/staff-dashboard");
      } else {
        setError("Invalid PIN. Please try again.");
      }
    },
    onError: () => {
      setError("Invalid PIN. Please try again.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyPinMutation.mutate(pin);
  };

  return (
    <Container>
      <Card>
        <Title>Welcome, {user?.name}</Title>
        <p>Enter your PIN to proceed</p>

        <form onSubmit={handleSubmit}>
          <Input
            type="password"
            maxLength="4"
            placeholder="****"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button type="submit" disabled={pin.length !== 4}>
            Verify PIN
          </Button>
        </form>
      </Card>
    </Container>
  );
};

export default VerifyPin;
