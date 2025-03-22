import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchServices, addService, searchCustomers } from "@/utils/api";
import styled from "styled-components";

// Styled Components
const Container = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadows.md};
  max-width: 1000px;
  margin: 0 auto;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.secondary};
  text-align: center;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  color: ${({ theme }) => theme.colors.secondary};
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  margin: 0 0.5rem;
  border: none;
  border-radius: 5px;
  background: ${({ active, theme }) =>
    active ? theme.colors.primary : "#f0f0f0"};
  color: ${({ active }) => (active ? "white" : "#333")};
  cursor: pointer;
  font-weight: ${({ active }) => (active ? "600" : "400")};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ active, theme }) =>
      active ? theme.colors.primary : "#e0e0e0"};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
`;

const Th = styled.th`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 1rem;
  text-align: left;
`;

const Td = styled.td`
  border-bottom: 1px solid #eee;
  padding: 1rem;
  text-align: left;
`;

const TrStriped = styled.tr`
  background-color: ${(props) => (props.index % 2 === 0 ? "#fff" : "#f9f9f9")};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  background-color: white;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${({ theme, secondary }) =>
    secondary ? "#fff" : theme.colors.primary};
  color: ${({ secondary }) => (secondary ? "#333" : "white")};
  border: ${({ secondary }) => (secondary ? "1px solid #ddd" : "none")};
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme, secondary }) =>
      secondary ? "#f5f5f5" : theme.colors.primary}dd;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const CustomerResults = styled.div`
  margin-top: 1rem;
  border: 1px solid #eee;
  border-radius: 5px;
  max-height: 300px;
  overflow-y: auto;
`;

const CustomerCard = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f9f9f9;
  }
`;

const CustomerInfo = styled.div`
  flex: 1;
`;

const CustomerName = styled.div`
  font-weight: 500;
`;

const CustomerPhone = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;

  &:after {
    content: "";
    width: 30px;
    height: 30px;
    border: 3px solid #eee;
    border-top: 3px solid ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const SuccessMessage = styled.div`
  background-color: #dff2e9;
  color: #287d5f;
  padding: 1rem;
  border-radius: 5px;
  margin: 1rem 0;
  display: flex;
  align-items: center;

  &:before {
    content: "✓";
    font-weight: bold;
    margin-right: 0.5rem;
  }
`;

const FormCard = styled.div`
  border: 1px solid #eee;
  border-radius: 5px;
  padding: 1.5rem;
  margin-top: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: flex-end;
`;

const AddService = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("ongoing");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [newService, setNewService] = useState({
    customerId: "",
    customerName: "",
    customerMobile: "",
    serviceType: "",
    status: "ongoing",
    scheduledDate: "",
    payment: {
      isPaid: false,
      amount: "",
    },
  });

  // Fetch services based on status
  const {
    data: services,
    isLoading: isLoadingServices,
    isError: isServicesError,
  } = useQuery({
    queryKey: ["services", statusFilter],
    queryFn: () => fetchServices(statusFilter),
  });

  // Search customers by name or number (only when search button is clicked)
  const {
    data: customerResults,
    isLoading: isLoadingCustomers,
    isError: isCustomersError,
    refetch: searchCustomersQuery,
  } = useQuery({
    queryKey: ["customers", searchTerm],
    queryFn: () => searchCustomers(searchTerm),
    enabled: false, // Don't fetch automatically
  });

  // Mutation to add service
  const addServiceMutation = useMutation({
    mutationFn: addService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setNewService({
        customerId: "",
        customerName: "",
        customerMobile: "",
        serviceType: "",
        status: "ongoing",
        scheduledDate: "",
        payment: {
          isPaid: false,
          amount: "",
        },
      });
      setSelectedCustomer(null);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    },
  });

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    searchCustomersQuery().finally(() => setIsSearching(false));
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setNewService({
      ...newService,
      customerId: customer._id,
      customerName: customer.name,
      customerMobile: customer.mobile,
    });
  };

  const handleAddService = (e) => {
    e.preventDefault();
    if (
      !newService.customerId ||
      !newService.serviceType ||
      !newService.scheduledDate
    )
      return;

    addServiceMutation.mutate(newService);
  };

  const resetForm = () => {
    setSelectedCustomer(null);
    setNewService({
      customerId: "",
      customerName: "",
      customerMobile: "",
      serviceType: "",
      status: "ongoing",
      scheduledDate: "",
      payment: {
        isPaid: false,
        amount: "",
      },
    });
  };

  // Format date to YYYY-MM-DD for the input
  const formatDateForInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  return (
    <Container>
      <Title>Service Management</Title>

      {/* Tabs for filtering services */}
      <TabContainer>
        {["ongoing", "completed", "scheduled"].map((status) => (
          <Tab
            key={status}
            active={statusFilter === status}
            onClick={() => setStatusFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Tab>
        ))}
      </TabContainer>

      {/* Services Table */}
      {isLoadingServices ? (
        <Loader />
      ) : isServicesError ? (
        <EmptyState>Error loading services. Please try again.</EmptyState>
      ) : services?.length === 0 ? (
        <EmptyState>No {statusFilter} services found.</EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Customer</Th>
              <Th>Contact</Th>
              <Th>Service Type</Th>
              <Th>Scheduled Date</Th>
              <Th>Payment</Th>
            </tr>
          </thead>
          <tbody>
            {services?.map((service, index) => (
              <TrStriped key={service._id} index={index}>
                <Td>{service.customerName}</Td>
                <Td>{service.customerMobile}</Td>
                <Td>{service.serviceType}</Td>
                <Td>{formatDateForInput(service.scheduledDate)}</Td>
                <Td>
                  {service.payment.isPaid
                    ? `₹${service.payment.amount}`
                    : "Pending"}
                </Td>
              </TrStriped>
            ))}
          </tbody>
        </Table>
      )}

      {/* Add Service Section */}
      <SectionTitle>Add New Service</SectionTitle>

      {/* Customer Search Section */}
      {!selectedCustomer && (
        <>
          <SearchContainer>
            <Input
              type="text"
              placeholder="Search customer by name or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button
              onClick={handleSearch}
              disabled={isSearching || !searchTerm.trim()}
            >
              Search
            </Button>
          </SearchContainer>

          {/* Customer Search Results */}
          {isSearching ? (
            <Loader />
          ) : isLoadingCustomers ? (
            <Loader />
          ) : isCustomersError ? (
            <EmptyState>
              Error searching customers. Please try again.
            </EmptyState>
          ) : customerResults?.length === 0 ? (
            searchTerm && (
              <EmptyState>No customers found matching your search.</EmptyState>
            )
          ) : (
            customerResults?.length > 0 && (
              <CustomerResults>
                {customerResults.map((customer) => (
                  <CustomerCard key={customer._id}>
                    {console.log(customer)}
                    <CustomerInfo>
                      <CustomerName>{customer.name}</CustomerName>
                      <CustomerPhone>{customer.mobile}</CustomerPhone>
                    </CustomerInfo>
                    <Button onClick={() => handleSelectCustomer(customer)}>
                      Select
                    </Button>
                  </CustomerCard>
                ))}
              </CustomerResults>
            )
          )}
        </>
      )}

      {/* Service Form */}
      {selectedCustomer && (
        <FormCard>
          {showSuccessMessage && (
            <SuccessMessage>Service added successfully!</SuccessMessage>
          )}

          <FormGroup>
            <Label>Customer</Label>
            <Input type="text" value={selectedCustomer.name} disabled />
          </FormGroup>

          <FormGroup>
            <Label>Contact Number</Label>
            <Input type="text" value={selectedCustomer.mobile} disabled />
          </FormGroup>

          <FormGroup>
            <Label>Service Type*</Label>
            <Input
              type="text"
              value={newService.serviceType}
              onChange={(e) =>
                setNewService({ ...newService, serviceType: e.target.value })
              }
              placeholder="E.g., Repair, Installation, Maintenance"
            />
          </FormGroup>

          <FormGroup>
            <Label>Service Status</Label>
            <Select
              value={newService.status}
              onChange={(e) =>
                setNewService({ ...newService, status: e.target.value })
              }
            >
              <option value="ongoing">Ongoing</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Scheduled Date*</Label>
            <Input
              type="date"
              value={newService.scheduledDate}
              onChange={(e) =>
                setNewService({ ...newService, scheduledDate: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup>
            <Label>Payment Status</Label>
            <Select
              value={newService.payment.isPaid ? "yes" : "no"}
              onChange={(e) => {
                const isPaid = e.target.value === "yes";
                setNewService({
                  ...newService,
                  payment: {
                    ...newService.payment,
                    isPaid,
                    amount: isPaid ? newService.payment.amount : "0",
                  },
                });
              }}
            >
              <option value="no">Payment Pending</option>
              <option value="yes">Payment Completed</option>
            </Select>
          </FormGroup>

          {newService.payment.isPaid && (
            <FormGroup>
              <Label>Amount (₹)*</Label>
              <Input
                type="number"
                value={newService.payment.amount}
                onChange={(e) =>
                  setNewService({
                    ...newService,
                    payment: {
                      ...newService.payment,
                      amount: e.target.value,
                    },
                  })
                }
                placeholder="Enter amount"
              />
            </FormGroup>
          )}

          <ButtonGroup>
            <Button secondary onClick={resetForm}>
              Cancel
            </Button>
            <Button
              onClick={handleAddService}
              disabled={
                addServiceMutation.isLoading ||
                !newService.serviceType ||
                !newService.scheduledDate ||
                (newService.payment.isPaid && !newService.payment.amount)
              }
            >
              {addServiceMutation.isLoading ? "Adding..." : "Add Service"}
            </Button>
          </ButtonGroup>
        </FormCard>
      )}
    </Container>
  );
};

export default AddService;
