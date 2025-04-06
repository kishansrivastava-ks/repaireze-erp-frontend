import { addReceivable, fetchReceivables, searchCustomers } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import styled from "styled-components";

const Receivables = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [newReceivable, setNewReceivable] = useState({
    customerId: "",
    customerName: "",
    customerMobile: "",
    serviceType: "",
    paymentType: "",
    amount: 0,
    paymentStatus: "",
    invoiceNumber: "",
  });

  const {
    data: receivables,
    isLoading: isLoadingReceivables,
    isError: isReceivalbesError,
  } = useQuery({
    queryKey: ["receivables"],
    queryFn: fetchReceivables,
  });

  const {
    data: customerResults,
    isLoading: isLoadingCustomers,
    isError: isCustomersError,
    refetch: searchCustomerQuery,
  } = useQuery({
    queryKey: ["customers", searchTerm],
    queryFn: () => searchCustomers(searchTerm),
    enabled: false,
  });

  const addReceivableMutation = useMutation({
    mutationFn: addReceivable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receivables"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setNewReceivable({
        customerId: "",
        customerName: "",
        customerMobile: "",
        serviceType: "",
        paymentType: "",
        amount: 0,
        paymentStatus: "",
        invoiceNumber: "",
      });
      setSelectedCustomer(null);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    },
  });

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    searchCustomerQuery().finally(() => setIsSearching(false));
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setNewReceivable({
      ...newReceivable,
      customerId: customer._id,
      customerName: customer.name,
      customerMobile: customer.mobile,
    });
  };

  const handleAddReceivable = (e) => {
    e.preventDefault();
    console.log("entered handle add receivable");
    console.log(newReceivable.customerId);
    console.log(newReceivable.serviceType);
    console.log(newReceivable.paymentStatus);
    if (
      !newReceivable.customerId ||
      !newReceivable.serviceType ||
      !newReceivable.paymentStatus
    )
      return;

    addReceivableMutation.mutate(newReceivable);
  };
  const resetForm = () => {
    setSelectedCustomer(null);
    setNewReceivable({
      customerId: "",
      customerName: "",
      customerMobile: "",
      serviceType: "",
      paymentType: "",
      amount: 0,
      paymentStatus: "",
      invoiceNumber: "",
    });
  };

  return (
    <Container>
      <Title>Receivables Management</Title>

      {isLoadingReceivables ? (
        <Loader />
      ) : isReceivalbesError ? (
        <EmptyState>Error loading receivables, Please try again</EmptyState>
      ) : receivables.length === 0 ? (
        <EmptyState>No receivables found</EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Customer</Th>
              <Th>Contact</Th>
              <Th>Service Type</Th>
              <Th>Payment Type</Th>
              <Th>Amount</Th>
              <Th>Payment Status</Th>
              <Th>Invoice No.</Th>
            </tr>
          </thead>
          <tbody>
            {receivables?.map((receivable, index) => (
              <TrStriped key={receivable._id} index={index}>
                <Td>{receivable.customerName}</Td>
                <Td>{receivable.customerMobile}</Td>
                <Td>{receivable.serviceType}</Td>
                <Td>{receivable.paymentType}</Td>
                <Td>{`₹ ${receivable.amount}`}</Td>
                <Td>{receivable.paymentStatus}</Td>
                <Td>
                  {receivable.invoiceNumber ? receivable.invoiceNumber : "NA"}
                </Td>
              </TrStriped>
            ))}
          </tbody>
        </Table>
      )}
      <SectionTitle>Add New Receivable</SectionTitle>
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

      {selectedCustomer && (
        <FormCard>
          {showSuccessMessage && (
            <SuccessMessage>Receivable Added Successfully</SuccessMessage>
          )}

          <FormGroup>
            <Label>Customer</Label>
            <Input type="text" value={selectedCustomer.name} disabled />
          </FormGroup>

          <FormGroup>
            <Label>Customer Number</Label>
            <Input disabled type="text" value={selectedCustomer.mobile} />
          </FormGroup>

          <FormGroup>
            <Label>Service Type*</Label>
            <Input
              type="text"
              value={newReceivable.serviceType}
              onChange={(e) =>
                setNewReceivable({
                  ...newReceivable,
                  serviceType: e.target.value,
                })
              }
              placeholder="E.g., Repair, Installation, Maintenance"
            />
          </FormGroup>

          <FormGroup>
            <Label>Payment Type</Label>
            <Select
              value={newReceivable.paymentType}
              onChange={(e) => {
                setNewReceivable({
                  ...newReceivable,
                  paymentType: e.target.value,
                });
              }}
            >
              <option value="">--Select Payment Type --</option>
              <option value="online">online</option>
              <option value="cash">cash</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Payment Status</Label>
            <Select
              value={newReceivable.paymentStatus}
              onChange={(e) => {
                setNewReceivable({
                  ...newReceivable,
                  paymentStatus: e.target.value,
                });
              }}
            >
              <option value="">---Select Status--</option>
              <option value="done">done</option>
              <option value="pending">pending</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Amount (₹)*</Label>
            <Input
              type="number"
              value={newReceivable.amount}
              onChange={(e) =>
                setNewReceivable({
                  ...newReceivable,
                  amount: e.target.value,
                })
              }
              placeholder="Enter amount"
            />
          </FormGroup>

          <FormGroup>
            <Label>Invoice Number</Label>
            <Input
              type="text"
              value={newReceivable.invoiceNumber}
              onChange={(e) =>
                setNewReceivable({
                  ...newReceivable,
                  invoiceNumber: e.target.value,
                })
              }
              placeholder="Enter Invoice No."
            />
          </FormGroup>

          <ButtonGroup>
            <Button secondary onClick={resetForm}>
              Cancel
            </Button>
            <Button
              onClick={handleAddReceivable}
              disabled={
                addReceivableMutation.isLoading ||
                !newReceivable.serviceType ||
                !newReceivable.amount
              }
            >
              {addReceivableMutation.isLoading ? "Adding..." : "Add Receivable"}
            </Button>
          </ButtonGroup>
        </FormCard>
      )}
    </Container>
  );
};

export default Receivables;

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
