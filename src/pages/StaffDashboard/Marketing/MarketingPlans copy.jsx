import { useAuth } from "@/context/AuthContext";
import { fetchMarketingPlans, addMarketingPlan } from "@/utils/api";
import { errorToast, successToast } from "@/utils/ToastNotfications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import styled from "styled-components";

function MarketingPlans() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [planType, setPlanType] = useState("physical");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [currentFilter, setCurrentFilter] = useState({
    field: "city",
    operator: "equals",
    value: "",
  });
  const [filters, setFilters] = useState([]);
  const [planData, setPlanData] = useState({
    type: "physical",
    city: "",
    area: "",
    expectedROAS: "",
    startDate: "",
    endDate: "",
    managedBy: user.id,
  });

  const { data: physicalPlans = [], isLoading: isLoadingPhysical } = useQuery({
    queryKey: ["marketingPlans", "physical"],
    queryFn: () => fetchMarketingPlans("physical"),
  });

  const { data: digitalPlans = [], isLoading: isLoadingDigital } = useQuery({
    queryKey: ["marketingPlans", "digital"],
    queryFn: () => fetchMarketingPlans("digital"),
  });

  // Combine plans
  const combinedPlans = [...physicalPlans, ...digitalPlans];

  // Advanced Filtering Logic
  const filteredData = useMemo(() => {
    return combinedPlans.filter((plan) => {
      return filters.every((filter) => {
        const value = plan[filter.field];
        const filterValue = filter.value;

        switch (filter.operator) {
          case "equals":
            return (
              String(value).toLowerCase() === String(filterValue).toLowerCase()
            );
          case "notEquals":
            return (
              String(value).toLowerCase() !== String(filterValue).toLowerCase()
            );
          case "contains":
            return String(value)
              .toLowerCase()
              .includes(String(filterValue).toLowerCase());
          case "notContains":
            return !String(value)
              .toLowerCase()
              .includes(String(filterValue).toLowerCase());
          case "greaterThan":
            return parseFloat(value) > parseFloat(filterValue);
          case "lessThan":
            return parseFloat(value) < parseFloat(filterValue);
          default:
            return true;
        }
      });
    });
  }, [combinedPlans, filters]);

  const mutation = useMutation({
    mutationFn: addMarketingPlan,
    onSuccess: () => {
      queryClient.invalidateQueries(["marketingPlans"]);
      successToast("Plan Added Successfully");

      setPlanData({
        type: planType,
        city: "",
        area: "",
        expectedROAS: "",
        startDate: "",
        endDate: "",
        managedBy: user.id,
      });
      setShowForm(false);
    },
    onError: (error) => {
      errorToast(`Error adding plan: ${error.message}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(planData);
  };

  const handleChange = (e) => {
    setPlanData({ ...planData, [e.target.name]: e.target.value });
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const cancelForm = () => {
    setShowForm(false);
    setPlanData({
      type: planType,
      city: "",
      area: "",
      expectedROAS: "",
      startDate: "",
      endDate: "",
      managedBy: user.id,
    });
  };

  // Filter Modal Component
  const FilterModal = () => {
    const fieldOptions = [
      { value: "city", label: "City" },
      { value: "area", label: "Area" },
      { value: "expectedROAS", label: "Expected ROAS" },
      { value: "startDate", label: "Start Date" },
      { value: "endDate", label: "End Date" },
    ];

    const operatorOptions = [
      { value: "equals", label: "Equals" },
      { value: "notEquals", label: "Not Equals" },
      { value: "contains", label: "Contains" },
      { value: "notContains", label: "Not Contains" },
      { value: "greaterThan", label: "Greater Than" },
      { value: "lessThan", label: "Less Than" },
    ];

    const handleAddFilter = () => {
      if (currentFilter.value.trim()) {
        setFilters([...filters, { ...currentFilter }]);
        setShowFilterModal(false);
        // Reset current filter
        setCurrentFilter({
          field: "city",
          operator: "equals",
          value: "",
        });
      }
    };

    return (
      <ModalOverlay>
        <ModalContent>
          <h2>Add Filter</h2>
          <Select
            value={currentFilter.field}
            onChange={(e) =>
              setCurrentFilter((prev) => ({
                ...prev,
                field: e.target.value,
              }))
            }
          >
            {fieldOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <Select
            value={currentFilter.operator}
            onChange={(e) =>
              setCurrentFilter((prev) => ({
                ...prev,
                operator: e.target.value,
              }))
            }
          >
            {operatorOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <Input
            type={currentFilter.field.includes("Date") ? "date" : "text"}
            value={currentFilter.value}
            onChange={(e) =>
              setCurrentFilter((prev) => ({
                ...prev,
                value: e.target.value,
              }))
            }
            placeholder="Enter filter value"
          />

          <ButtonGroup>
            <FormButton onClick={handleAddFilter}>Add Filter</FormButton>
            <CancelButton onClick={() => setShowFilterModal(false)}>
              Cancel
            </CancelButton>
          </ButtonGroup>
        </ModalContent>
      </ModalOverlay>
    );
  };

  // Active Filters Display Component
  const ActiveFilters = () => {
    if (filters.length === 0) return null;

    const removeFilter = (filterToRemove) => {
      setFilters(filters.filter((filter) => filter !== filterToRemove));
    };

    const clearFilters = () => {
      setFilters([]);
    };

    return (
      <FilterChipsContainer>
        {filters.map((filter, index) => (
          <FilterChip key={index}>
            {filter.field} {filter.operator} {filter.value}
            <RemoveFilterButton onClick={() => removeFilter(filter)}>
              ✕
            </RemoveFilterButton>
          </FilterChip>
        ))}
        <ClearFiltersButton onClick={clearFilters}>
          Clear All Filters
        </ClearFiltersButton>
      </FilterChipsContainer>
    );
  };

  const renderPlanTable = (plans, type) => {
    // Filter plans by type
    const typedPlans = plans.filter((plan) => plan.type === type);

    return typedPlans.length === 0 ? (
      <EmptyState>
        <p>No {type} marketing plans found</p>
      </EmptyState>
    ) : (
      <Table>
        <thead>
          <tr>
            <Th>City</Th>
            <Th>Area</Th>
            <Th>Expected ROAS</Th>
            <Th>Start Date</Th>
            <Th>End Date</Th>
          </tr>
        </thead>
        <tbody>
          {typedPlans.map((plan) => (
            <TableRow key={plan._id}>
              <Td>{plan.city}</Td>
              <Td>{plan.area}</Td>
              <Td>{plan.expectedROAS}</Td>
              <Td>{new Date(plan.startDate).toLocaleDateString()}</Td>
              <Td>{new Date(plan.endDate).toLocaleDateString()}</Td>
            </TableRow>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <Container>
      <Title>Marketing Plans Management</Title>

      {/* Filter Button */}
      <AddFilterButton onClick={() => setShowFilterModal(true)}>
        + Add Filter
      </AddFilterButton>

      {/* Active Filters Display */}
      <ActiveFilters />

      {!showForm ? (
        <AddButton onClick={toggleForm}>+ Add New Plan</AddButton>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Select
            name="type"
            value={planData.type}
            onChange={(e) => {
              setPlanType(e.target.value);
              setPlanData({ ...planData, type: e.target.value });
            }}
          >
            <option value="physical">Physical Plan</option>
            <option value="digital">Digital Plan</option>
          </Select>
          <Input
            type="text"
            name="city"
            placeholder="city"
            value={planData.city}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="area"
            placeholder="area"
            onChange={handleChange}
            required
            value={planData.area}
          />
          <Input
            type="text"
            name="expectedROAS"
            placeholder="Expected ROAS"
            value={planData.expectedROAS}
            onChange={handleChange}
            required
          />
          <Input
            type="date"
            name="startDate"
            placeholder="Start Date"
            value={planData.startDate}
            onChange={handleChange}
            required
          />
          <Input
            type="date"
            name="endDate"
            placeholder="End Date"
            value={planData.endDate}
            onChange={handleChange}
            required
          />
          <ButtonGroup>
            <FormButton type="submit" disabled={mutation.isLoading}>
              {mutation.isLoading ? (
                <>
                  <LoadingSpinner />
                  Adding...
                </>
              ) : (
                "Add Plan"
              )}
            </FormButton>
            <CancelButton type="button" onClick={cancelForm}>
              Cancel
            </CancelButton>
          </ButtonGroup>
        </Form>
      )}

      <Title>Physical Marketing Plans</Title>
      {isLoadingPhysical ? (
        <LoadingContainer>
          <LoadingSpinner />
          <p>loading physical plans...</p>
        </LoadingContainer>
      ) : (
        renderPlanTable(filteredData, "physical")
      )}

      <Title>Digital Marketing Plans</Title>
      {isLoadingDigital ? (
        <LoadingContainer>
          <LoadingSpinner />
          <p>loading digital plans...</p>
        </LoadingContainer>
      ) : (
        renderPlanTable(filteredData, "digital")
      )}

      {/* Filter Modal */}
      {showFilterModal && <FilterModal />}
    </Container>
  );
}

export default MarketingPlans;

const Container = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.secondary};
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  max-width: 800px;
  margin: 1.5rem auto;
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Input = styled.input`
  flex: 1 1 45%;
  padding: 0.8rem;
  border: 1px solid ${({ theme }) => theme.colors.muted};
  border-radius: 5px;
  font-size: 1rem;
  min-width: 200px;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
    box-shadow: 0 0 3px ${({ theme }) => theme.colors.primary};
  }
`;

const Select = styled.select`
  flex: 1 1 45%;
  padding: 0.8rem;
  border: 1px solid ${({ theme }) => theme.colors.muted};
  border-radius: 5px;
  font-size: 1rem;
  min-width: 200px;
`;

const Button = styled.button`
  padding: 0.8rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.muted};
    cursor: not-allowed;
  }
`;

const AddButton = styled(Button)`
  margin: 0 auto 2rem;
  width: auto;
  padding: 0.8rem 1.5rem;
`;

const FormButton = styled(Button)`
  width: 100%;
  max-width: 200px;
`;

const CancelButton = styled.button`
  padding: 0.8rem;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.secondary};
  border: 1px solid ${({ theme }) => theme.colors.muted};
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  max-width: 200px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.lightGray || "#f5f5f5"};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  width: 100%;
  justify-content: center;
`;

const Table = styled.table`
  width: 100%;
  margin-top: 2rem;
  border-collapse: collapse;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
`;

const Th = styled.th`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 12px;
  text-align: left;
`;

const Td = styled.td`
  border-bottom: 1px solid ${({ theme }) => theme.colors.muted};
  padding: 12px;
`;

const TableRow = styled.tr`
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.lightGray || "#f5f5f5"};
  }
`;

const LoadingSpinner = styled.div`
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top: 3px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  margin: 0 auto;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;
`;

const CampaignCard = styled.div`
  background: ${({ theme }) => theme.colors.lightGray || "#f5f5f5"};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

// Styled Components for Filter UI
const AddFilterButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 15px;
  margin: 10px 0;
  border-radius: 4px;
  cursor: pointer;
`;

const FilterChipsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 10px 0;
`;

const FilterChip = styled.div`
  background-color: #f0f0f0;
  border-radius: 20px;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const RemoveFilterButton = styled.button`
  background: none;
  border: none;
  color: red;
  cursor: pointer;
`;

const ClearFiltersButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
