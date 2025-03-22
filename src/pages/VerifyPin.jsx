/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { motion, AnimatePresence } from "framer-motion";

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  return (
    <ToastWrapper
      initial={{ opacity: 0, y: 50, x: "-50%" }}
      animate={{ opacity: 1, y: 0, x: "-50%" }}
      exit={{ opacity: 0, y: 50, x: "-50%" }}
      type={type}
    >
      <ToastMessage>{message}</ToastMessage>
      <ToastCloseButton onClick={onClose}>&times;</ToastCloseButton>
    </ToastWrapper>
  );
};

// PIN Input component
const PinInput = ({ value, onChange, maxLength, disabled }) => {
  const pinDigits = new Array(maxLength).fill("");

  // Fill the array with actual digits when available
  for (let i = 0; i < value.length && i < maxLength; i++) {
    pinDigits[i] = value[i];
  }

  return (
    <PinInputContainer>
      {pinDigits.map((digit, index) => (
        <PinDigit
          key={index}
          isFilled={index < value.length}
          active={index === value.length}
          initial={{ scale: 0.9, opacity: 0.7 }}
          animate={{
            scale: index === value.length - 1 ? 1.05 : 1,
            opacity: 1,
          }}
          transition={{ duration: 0.2 }}
        />
      ))}
      <HiddenInput
        type="password"
        maxLength={maxLength}
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoFocus
      />
    </PinInputContainer>
  );
};

// Loading spinner component
const Spinner = () => (
  <SpinnerWrapper>
    <SpinnerRing />
  </SpinnerWrapper>
);

// Styled Components
const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.light} 0%,
    #f8f9fa 100%
  );
  position: relative;
  overflow: hidden;
`;

const BackgroundShape = styled(motion.div)`
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(0, 112, 243, 0.05) 0%,
    rgba(0, 112, 243, 0.02) 100%
  );
  z-index: 0;
`;

const Card = styled(motion.div)`
  position: relative;
  z-index: 1;
  padding: ${({ theme }) => theme.space.xl};
  background: white;
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  text-align: center;
  max-width: 400px;
  width: 100%;
`;

const Logo = styled.div`
  margin-bottom: ${({ theme }) => theme.space.lg};
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  opacity: 0.8;
`;

const Title = styled.h2`
  margin-bottom: ${({ theme }) => theme.space.md};
  color: ${({ theme }) => theme.colors.dark};
  font-weight: 600;
`;

const WelcomeText = styled.div`
  margin-bottom: ${({ theme }) => theme.space.lg};
`;

const UserName = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const Instruction = styled(motion.p)`
  margin-bottom: ${({ theme }) => theme.space.md};
  color: ${({ theme }) => theme.colors.dark};
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

const PinInputContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.space.sm};
  margin: ${({ theme }) => theme.space.lg} 0;
  position: relative;
`;

const PinDigit = styled(motion.div)`
  width: 50px;
  height: 60px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 2px solid
    ${({ theme, isFilled, active }) =>
      active
        ? theme.colors.primary
        : isFilled
          ? theme.colors.dark
          : theme.colors.muted};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: ${({ theme, isFilled }) =>
    isFilled ? "rgba(0, 112, 243, 0.05)" : "transparent"};
  box-shadow: ${({ theme, active }) =>
    active ? "0 0 0 2px rgba(0, 112, 243, 0.2)" : "none"};

  &::after {
    content: "";
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.dark};
    display: ${({ isFilled }) => (isFilled ? "block" : "none")};
  }
`;

const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  cursor: pointer;
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: ${({ theme }) => theme.space.md};
  margin-top: ${({ theme }) => theme.space.lg};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;

  &:hover {
    background-color: #0051b3;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }

  &:disabled {
    background-color: #adb5bd;
    cursor: not-allowed;
    transform: translateY(0);
    box-shadow: none;
  }
`;

const ErrorMessage = styled(motion.p)`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: ${({ theme }) => theme.space.sm};
  display: flex;
  align-items: center;
  justify-content: center;

  &:before {
    content: "⚠️";
    margin-right: ${({ theme }) => theme.space.xs};
  }
`;

const Footer = styled.div`
  margin-top: ${({ theme }) => theme.space.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.darkGray};
`;

const SpinnerWrapper = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  position: relative;
`;

const SpinnerRing = styled.div`
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid #fff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ToastWrapper = styled(motion.div)`
  position: fixed;
  bottom: 30px;
  left: 50%;
  background-color: ${({ type, theme }) =>
    type === "error"
      ? theme.colors.danger
      : type === "success"
        ? "#10b981"
        : theme.colors.primary};
  color: white;
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.lg}`};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  z-index: 1000;
  min-width: 300px;
`;

const ToastMessage = styled.span`
  flex: 1;
`;

const ToastCloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 0 0 0 ${({ theme }) => theme.space.sm};
  opacity: 0.7;

  &:hover {
    opacity: 1;
  }
`;

const VerifyPin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ visible: false, message: "", type: "" });
  const queryClient = useQueryClient();

  const verifyPinMutation = useMutation({
    mutationFn: async (pin) => {
      return await authService.verifyPin({ pin });
    },
    onSuccess: (responseData) => {
      if (responseData.verified) {
        queryClient.setQueryData(["authUser"], responseData);

        // Show success toast
        setToast({
          visible: true,
          message: "PIN verified successfully!",
          type: "success",
        });

        // Delayed navigation to show the toast
        setTimeout(() => {
          navigate("/staff-dashboard");
        }, 1000);
      } else {
        setError("Invalid PIN. Please try again.");

        // Clear the PIN input
        setPin("");
      }
    },
    onError: () => {
      setError("Invalid PIN. Please try again.");

      // Clear the PIN input
      setPin("");
    },
  });

  const handlePinChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "").substring(0, 4);
    setPin(value);

    // Clear error when user starts typing again
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin.length === 4) {
      verifyPinMutation.mutate(pin);
    }
  };

  const closeToast = () => {
    setToast({ ...toast, visible: false });
  };

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background shapes for visual interest */}
      <BackgroundShape
        initial={{ x: "-20%", y: "-20%", opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={{ top: -100, left: -100 }}
      />
      <BackgroundShape
        initial={{ x: "20%", y: "20%", opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 1.5, delay: 0.2 }}
        style={{ bottom: -150, right: -100 }}
      />

      <Card
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Logo>Mendt Technologies Private Limited</Logo>
        <Title>Two-Factor Authentication</Title>

        <WelcomeText>
          Welcome, <UserName>{user?.name || "User"}</UserName>
        </WelcomeText>

        <Instruction
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Please enter your 4-digit PIN to continue
        </Instruction>

        <form onSubmit={handleSubmit}>
          <PinInput
            value={pin}
            onChange={handlePinChange}
            maxLength={4}
            disabled={verifyPinMutation.isPending}
          />

          <AnimatePresence>
            {error && (
              <ErrorMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {error}
              </ErrorMessage>
            )}
          </AnimatePresence>

          <Button
            type="submit"
            disabled={pin.length !== 4 || verifyPinMutation.isPending}
            whileTap={{ scale: 0.98 }}
          >
            {verifyPinMutation.isPending ? <Spinner /> : "Verify PIN"}
          </Button>
        </form>

        <Footer>
          © {new Date().getFullYear()} Mendt Technologies Pvt. Ltd.
        </Footer>
      </Card>

      {/* Toast notifications */}
      <AnimatePresence>
        {toast.visible && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={closeToast}
          />
        )}
      </AnimatePresence>
    </Container>
  );
};

export default VerifyPin;
