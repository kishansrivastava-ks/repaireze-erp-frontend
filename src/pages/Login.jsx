import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { z } from "zod";

const loginSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.light};
`;

const LoginForm = styled.form`
  width: 100%;
  max-width: 400px;
  padding: ${({ theme }) => theme.space.xl};
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.space.lg};
  color: ${({ theme }) => theme.colors.primary};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.space.xs};
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.space.sm};
  border: 1px solid ${({ theme }) => theme.colors.muted};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.fontSizes.md};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
  }
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: ${({ theme }) => theme.space.xs};
`;

const Button = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.space.md};
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

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

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
      console.log("User logged in", userData);

      // redirection based on usertype
      if (userData.userType === "staff") {
        navigate("/verify-pin");
      } else {
        navigate("/admin-dashboard");
      }
    } catch (error) {
      console.error("Error logging in", error);
      alert(error.message || "Login failed Please try again !");
    }
  };

  return (
    <LoginContainer
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <LoginForm onSubmit={handleSubmit(onSubmit)}>
        <Title>Login to ERP System</Title>

        <FormGroup>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="text"
            placeholder="Enter your phone number"
            {...register("phone")}
          />
          {errors.phone && <ErrorMessage>{errors.phone.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register("password")}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </FormGroup>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;
