import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addStaff } from "@/utils/api";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaUserTag,
  FaLock,
  FaIdCard,
  FaCheck,
  FaTimes,
  FaChevronLeft,
  FaPhoneVolume,
} from "react-icons/fa";

// Main container with improved styling
const Container = styled(motion.div)`
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  max-width: 550px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

// Page header
const Header = styled.div`
  margin-bottom: 2rem;
  position: relative;
  /* border: 2px solid red; */
`;

// Back button
const BackButton = styled(motion.button)`
  position: absolute;
  left: 0;
  top: 0;
  background: none;
  border: none;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0;

  z-index: 5;

  &:hover {
    color: #3949ab;
  }
`;

// Page title
const Title = styled.h2`
  color: #1a237e;
  text-align: center;
  margin: 0;
  font-weight: 600;
  position: relative;
`;

// Form subtitle
const Subtitle = styled.p`
  text-align: center;
  color: #64748b;
  margin: 0.5rem 0 0;
  font-size: 0.95rem;
`;

// Progress indicator
const ProgressIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin: 1.5rem 0;
  gap: 0.75rem;
`;

// Progress step
const ProgressStep = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${(props) => (props.active ? "#3949ab" : "#e0e7ff")};
  transition: background-color 0.3s ease;
`;

// Form container
const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

// Form section wrapper
const FormSection = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// Form row for fields that should be side by side
const FormRow = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

// Form group with label and input
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

// Input label
const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;

  svg {
    margin-right: 0.5rem;
    color: #64748b;
  }
`;

// Enhanced input field
const Input = styled.div`
  position: relative;

  input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 0.95rem;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: #3949ab;
      box-shadow: 0 0 0 3px rgba(57, 73, 171, 0.1);
    }

    &::placeholder {
      color: #94a3b8;
    }
  }
`;

// Input help text
const HelpText = styled.div`
  font-size: 0.75rem;
  color: ${(props) => (props.error ? "#ef4444" : "#94a3b8")};
  margin-top: 0.35rem;
  display: flex;
  align-items: center;

  svg {
    margin-right: 0.25rem;
    font-size: 0.7rem;
  }
`;

// Form actions container
const FormActions = styled.div`
  display: flex;
  justify-content: ${(props) =>
    props.isFirstStep ? "flex-end" : "space-between"};
  margin-top: 2rem;
`;

// Navigation button for form steps
const NavButton = styled(motion.button)`
  background-color: ${(props) => (props.isPrimary ? "#3949ab" : "#f8fafc")};
  color: ${(props) => (props.isPrimary ? "white" : "#64748b")};
  border: ${(props) => (props.isPrimary ? "none" : "1px solid #e2e8f0")};
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.isPrimary ? "#303f9f" : "#f1f5f9")};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

// Submit button for form
const SubmitButton = styled(motion.button)`
  background-color: #3949ab;
  color: white;
  padding: 0.9rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  margin-top: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    background-color: #303f9f;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .button-text {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

// Loading spinner
const Spinner = styled(motion.div)`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

// Toast notification
const Toast = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: ${(props) =>
    props.type === "success" ? "#10b981" : "#ef4444"};
  color: white;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 1000;

  svg {
    font-size: 1.25rem;
  }
`;

// Success dialog
const SuccessDialog = styled(motion.div)`
  text-align: center;
  padding: 2rem 1rem;

  svg {
    font-size: 4rem;
    color: #10b981;
    margin-bottom: 1.5rem;
  }

  h3 {
    font-size: 1.5rem;
    color: #1f2937;
    margin: 0 0 0.75rem;
  }

  p {
    color: #64748b;
    margin: 0 0 2rem;
  }
`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 },
  },
};

const toastVariants = {
  hidden: { opacity: 0, y: 50, x: 0 },
  visible: { opacity: 1, y: 0, x: 0 },
  exit: { opacity: 0, y: 50, x: 0 },
};

const AddStaff = () => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm();
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState(null);
  const [success, setSuccess] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  // Watch pin field to ensure it's 4 digits
  const pinValue = watch("pin", "");

  useEffect(() => {
    if (!user || user.userType !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  // Mutation for adding staff
  const mutation = useMutation({
    mutationFn: addStaff,
    onSuccess: () => {
      queryClient.invalidateQueries(["staffs"]);
      setSuccess(true);
      reset();
    },
    onError: (error) => {
      setToast({
        type: "error",
        message: error.message || "Failed to add staff. Please try again.",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  // Handle step navigation
  const nextStep = () => {
    setStep((current) => current + 1);
  };

  const prevStep = () => {
    setStep((current) => current - 1);
  };

  // Navigate to staff list
  const goToStaffList = () => {
    navigate("/admin-dashboard/staffs");
  };

  // Clear toast after display
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Validate pin is exactly 4 digits
  const isPinValid = () => {
    return /^\d{4}$/.test(pinValue);
  };

  // Add a new staff
  const addAnother = () => {
    setSuccess(false);
    setStep(1);
    reset();
  };

  return (
    <Container
      // initial="hidden"
      // animate="visible"
      // exit="exit"
      variants={containerVariants}
    >
      {!success ? (
        <>
          <Header>
            {step > 1 && (
              <BackButton
                onClick={prevStep}
                whileHover={{ x: -3 }}
                whileTap={{ scale: 0.97 }}
              >
                <FaChevronLeft /> Back
              </BackButton>
            )}
            <Title>Add New Staff Member</Title>
            <Subtitle>Enter the details to create a new staff account</Subtitle>

            <ProgressIndicator>
              <ProgressStep active={step >= 1} />
              <ProgressStep active={step >= 2} />
            </ProgressIndicator>
          </Header>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <FormSection
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <FormGroup>
                    <Label>
                      <FaUser /> Full Name
                    </Label>
                    <Input>
                      <input
                        {...register("name", { required: true })}
                        placeholder="Enter full name"
                      />
                    </Input>
                    {errors.name && (
                      <HelpText error>
                        <FaTimes /> Name is required
                      </HelpText>
                    )}
                  </FormGroup>

                  <FormRow>
                    <FormGroup>
                      <Label>
                        <FaPhone /> Phone Number
                      </Label>
                      <Input>
                        <input
                          {...register("phone", { required: true })}
                          placeholder="Primary contact"
                        />
                      </Input>
                      {errors.phone && (
                        <HelpText error>
                          <FaTimes /> Phone number is required
                        </HelpText>
                      )}
                    </FormGroup>

                    <FormGroup>
                      <Label>
                        <FaPhoneVolume /> Alternate Phone
                      </Label>
                      <Input>
                        <input
                          {...register("alternatePhone", { required: true })}
                          placeholder="Secondary contact"
                        />
                      </Input>
                      {errors.alternatePhone && (
                        <HelpText error>
                          <FaTimes /> Alternate phone is required
                        </HelpText>
                      )}
                    </FormGroup>
                  </FormRow>

                  <FormGroup>
                    <Label>
                      <FaMapMarkerAlt /> Address
                    </Label>
                    <Input>
                      <input
                        {...register("address", { required: true })}
                        placeholder="Full address"
                      />
                    </Input>
                    {errors.address && (
                      <HelpText error>
                        <FaTimes /> Address is required
                      </HelpText>
                    )}
                  </FormGroup>

                  <FormActions isFirstStep>
                    <NavButton
                      type="button"
                      onClick={nextStep}
                      isPrimary
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Continue{" "}
                      <FaChevronLeft style={{ transform: "rotate(180deg)" }} />
                    </NavButton>
                  </FormActions>
                </FormSection>
              )}

              {step === 2 && (
                <FormSection
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <FormGroup>
                    <Label>
                      <FaUserTag /> Staff Role
                    </Label>
                    <Input>
                      <input
                        {...register("staffRole", { required: true })}
                        placeholder="Position or department"
                      />
                    </Input>
                    {errors.staffRole && (
                      <HelpText error>
                        <FaTimes /> Staff role is required
                      </HelpText>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label>
                      <FaLock /> Password
                    </Label>
                    <Input>
                      <input
                        {...register("password", {
                          required: true,
                          minLength: 6,
                        })}
                        type="password"
                        placeholder="Create password"
                      />
                    </Input>
                    {errors.password && errors.password.type === "required" && (
                      <HelpText error>
                        <FaTimes /> Password is required
                      </HelpText>
                    )}
                    {errors.password &&
                      errors.password.type === "minLength" && (
                        <HelpText error>
                          <FaTimes /> Password must be at least 6 characters
                        </HelpText>
                      )}
                    {!errors.password && (
                      <HelpText>
                        Passwords must be at least 6 characters
                      </HelpText>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label>
                      <FaIdCard /> 4-digit PIN
                    </Label>
                    <Input>
                      <input
                        {...register("pin", {
                          required: true,
                          pattern: /^\d{4}$/,
                          minLength: 4,
                          maxLength: 4,
                        })}
                        type="password"
                        placeholder="4-digit PIN for login"
                        maxLength={4}
                      />
                    </Input>
                    {errors.pin && (
                      <HelpText error>
                        <FaTimes /> PIN must be exactly 4 digits
                      </HelpText>
                    )}
                    {!errors.pin && (
                      <HelpText>
                        {isPinValid() ? (
                          <>
                            <FaCheck /> Valid 4-digit PIN
                          </>
                        ) : (
                          <>PIN must be exactly 4 digits</>
                        )}
                      </HelpText>
                    )}
                  </FormGroup>

                  <SubmitButton
                    type="submit"
                    disabled={mutation.isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {mutation.isLoading ? (
                      <Spinner
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    ) : (
                      <span className="button-text">
                        <FaUser /> Add Staff Member
                      </span>
                    )}
                  </SubmitButton>
                </FormSection>
              )}
            </AnimatePresence>
          </Form>
        </>
      ) : (
        <SuccessDialog
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <FaCheck />
          </motion.div>
          <h3>Staff Added Successfully!</h3>
          <p>The new staff member has been added to your organization.</p>
          <FormRow>
            <NavButton
              type="button"
              onClick={goToStaffList}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Staff List
            </NavButton>
            <NavButton
              type="button"
              onClick={addAnother}
              isPrimary
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Add Another Staff``
            </NavButton>
          </FormRow>
        </SuccessDialog>
      )}

      <AnimatePresence>
        {toast && (
          <Toast
            type={toast.type}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={toastVariants}
          >
            {toast.type === "success" ? <FaCheck /> : <FaTimes />}
            <span>{toast.message}</span>
          </Toast>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default AddStaff;
