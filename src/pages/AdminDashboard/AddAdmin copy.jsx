import { useState } from "react";
import styled from "styled-components";
import api from "@/services/api";

function AddAdmin() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    alternatePhone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // basic validations
    if (
      !formData.name ||
      !formData.phone ||
      !formData.address ||
      !formData.password
    ) {
      setError("Please fill all the fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Please enter a valid 10 digit phone number");
      return;
    }

    if (formData.alternatePhone && !phoneRegex.test(formData.alternatePhone)) {
      setError("Please enter a valid 10 digit alternate phone number");
      return;
    }

    try {
      setLoading(true);

      // creating a payload withou confirm password
      const payload = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        alternatePhone: formData.alternatePhone || formData.phone,
        password: formData.password,
      };

      const response = await api.post("/setup/create-admin", payload);

      setSuccess(true);
      setFormData({
        name: "",
        phone: "",
        address: "",
        alternatePhone: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Somthing went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <FormCard>
        <FormHeader>Add New Administrator</FormHeader>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>Admin created successfully</SuccessMessage>}

        <StyledForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">
              Full Name<Required>*</Required>
            </Label>
            <Input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />
          </FormGroup>
          <FormRow>
            <FormGroup>
              <Label htmlFor="phone">
                Phone Number <Required>*</Required>
              </Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter 10 digit phone number"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="alternatePhone">
                Alternate Phone Number <Required>*</Required>
              </Label>
              <Input
                type="tel"
                id="alternatePhone"
                name="alternatePhone"
                value={formData.alternatePhone}
                onChange={handleChange}
                placeholder="Enter 10 digit alternate phone number"
                required
              />
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label htmlFor="address">
              Address <Required>*</Required>
            </Label>
            <Input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter complete address"
              required
              rows={3}
            />
          </FormGroup>

          <FormRow>
            <FormGroup>
              <Label htmlFor="password">
                Password <Required>*</Required>
              </Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="confirmPassword">
                Confirm Password <Required>*</Required>
              </Label>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
              />
            </FormGroup>
          </FormRow>

          <ButtonGroup>
            <ResetButton
              type="reset"
              onClick={() => {
                setFormData({
                  name: "",
                  phone: "",
                  alternatePhone: "",
                  address: "",
                  password: "",
                  confirmPassword: "",
                });
                setError("");
              }}
            >
              Clear Form
            </ResetButton>
            <SubmitButton>
              {loading ? "Creating..." : "Create Admin"}
            </SubmitButton>
          </ButtonGroup>
        </StyledForm>
      </FormCard>
    </Container>
  );
}

// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: stretch;
  align-items: stretch;
  background-color: #f8fafb;
`;

const FormCard = styled.div`
  width: 100%;
  background: white;
  padding: 2rem;
  transition: all 0.3s ease;
`;

const FormHeader = styled.h1`
  color: #1a3353;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.2rem;
  }
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
  color: #495057;
  display: flex;
  align-items: center;
`;

const Required = styled.span`
  color: #d32f2f;
  margin-left: 4px;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #e1e5eb;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: #f8fafc;

  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.15);
    background-color: #fff;
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

const PasswordInput = styled(Input)`
  letter-spacing: 0.08em;
`;

const TextArea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 1px solid #e1e5eb;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s ease;
  resize: vertical;
  min-height: 80px;
  background-color: #f8fafc;

  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.15);
    background-color: #fff;
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 500px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
  border: none;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled(Button)`
  background-color: #1a73e8;
  color: white;
  flex: 2;

  &:hover:not(:disabled) {
    background-color: #0d62d0;
    box-shadow: 0 4px 8px rgba(26, 115, 232, 0.2);
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }
`;

const ResetButton = styled(Button)`
  background-color: transparent;
  color: #606770;
  border: 1px solid #dadce0;
  flex: 1;

  &:hover {
    background-color: #f1f3f4;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const ErrorMessage = styled.div`
  padding: 0.75rem 1rem;
  background-color: #fdeded;
  border-left: 4px solid #d32f2f;
  color: #5f2120;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  padding: 0.75rem 1rem;
  background-color: #edf7ed;
  border-left: 4px solid #2e7d32;
  color: #1e4620;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

export default AddAdmin;
