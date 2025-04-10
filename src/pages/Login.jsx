import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { useState } from "react";

// Schema definition
const loginSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Toast component
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

// Spinner component
const Spinner = () => (
  <SpinnerWrapper>
    <SpinnerRing />
  </SpinnerWrapper>
);

// Styled Components
const LoginContainer = styled(motion.div)`
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
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(0, 112, 243, 0.05) 0%,
    rgba(0, 112, 243, 0.02) 100%
  );
  z-index: 0;

  @media (max-width: 768px) {
    width: 300px;
    height: 300px;
  }
`;

const LoginFormContainer = styled(motion.div)`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px; /* Add padding for mobile */
`;

const CompanyLogo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space.lg};

  @media (max-width: 768px) {
    margin-bottom: ${({ theme }) => theme.space.md};
  }
`;

const LogoText = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
  letter-spacing: -0.5px;
  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes.lg};
  }
`;

const Tagline = styled.p`
  color: ${({ theme }) => theme.colors.dark};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: ${({ theme }) => theme.space.xs};
  opacity: 0.7;
`;

const LoginForm = styled(motion.form)`
  width: 100%;
  padding: ${({ theme }) => theme.space.xl};
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.space.md};
    box-shadow: none;
    border-radius: 0;
    background-color: transparent;
  }
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.space.lg};
  color: ${({ theme }) => theme.colors.dark};
  font-weight: 600;
  font-size: ${({ theme }) => theme.fontSizes.lg};

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes.md};
    margin-bottom: ${({ theme }) => theme.space.md};
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.space.md};
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.space.xs};
  font-weight: 600;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.dark};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.space.md};
  border: 1px solid
    ${({ theme, error }) => (error ? theme.colors.danger : theme.colors.muted)};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  transition: all 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(0, 112, 243, 0.15);
  }

  &::placeholder {
    color: #adb5bd;
  }

  @media (max-width: 768px) {
    /* padding: ${({ theme }) => theme.space.sm}; */
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
`;

const ErrorMessage = styled(motion.p)`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: ${({ theme }) => theme.space.xs};
  display: flex;
  align-items: center;

  &:before {
    content: "⚠️";
    margin-right: ${({ theme }) => theme.space.xs};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: ${({ theme }) => theme.space.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;
  overflow: hidden;
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

const Footer = styled.div`
  margin-top: ${({ theme }) => theme.space.lg};
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.darkGray};
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

  @media (max-width: 480px) {
    min-width: 90%;
    max-width: 95%;
    padding: ${({ theme }) => `${theme.space.xs} ${theme.space.md}`};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    top: 20px;
    height: 40px;
  }
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

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState({ visible: false, message: "", type: "" });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const userData = await login({
        phone: data.phone,
        password: data.password,
      });
      // console.log("User logged in", userData);

      // Show success toast
      setToast({
        visible: true,
        message: "Login successful!",
        type: "success",
      });

      // Delayed navigation to show the toast
      setTimeout(() => {
        // Redirection based on usertype
        if (userData.userType === "staff") {
          navigate("/verify-pin");
        } else {
          navigate("/admin-dashboard");
        }
      }, 1000);
    } catch (error) {
      console.error("Error logging in", error);

      // Show error toast
      setToast({
        visible: true,
        message: error.message || "Login failed. Please try again!",
        type: "error",
      });
    }
  };

  const closeToast = () => {
    setToast({ ...toast, visible: false });
  };

  return (
    <LoginContainer
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

      <LoginFormContainer>
        <CompanyLogo>
          <LogoText>RepairEze</LogoText>
          {/* <Tagline>Private Limited</Tagline> */}
        </CompanyLogo>

        <LoginForm
          onSubmit={handleSubmit(onSubmit)}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Title>Enterprise Resource Planning</Title>

          <FormGroup>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="text"
              placeholder="Enter your phone number"
              error={errors.phone}
              {...register("phone")}
            />
            <AnimatePresence>
              {errors.phone && (
                <ErrorMessage
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {errors.phone.message}
                </ErrorMessage>
              )}
            </AnimatePresence>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              error={errors.password}
              {...register("password")}
            />
            <AnimatePresence>
              {errors.password && (
                <ErrorMessage
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {errors.password.message}
                </ErrorMessage>
              )}
            </AnimatePresence>
          </FormGroup>

          <Button
            type="submit"
            disabled={isSubmitting}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? <Spinner /> : "Login"}
          </Button>

          <Footer>
            © {new Date().getFullYear()} Mendt Technologies Pvt. Ltd. All
            rights reserved.
          </Footer>
        </LoginForm>
      </LoginFormContainer>

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
    </LoginContainer>
  );
};

export default Login;
