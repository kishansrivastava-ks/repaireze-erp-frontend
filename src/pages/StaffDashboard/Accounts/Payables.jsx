import { fetchPayables, addPayable, searchVendors } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import styled from "styled-components";

const Payables = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [newPayable, setNewPayable] = useState({
    vendorId: "",
    vendorName: "",
    vendorMobile: "",
    serviceType: "",
    paymentAmount: 0,
    paymentStatus: "",
    invoiceNumber: "",
  });

  const {
    data: payables,
    isLoading: isLoadingPayables,
    isError: isPayablesError,
  } = useQuery({
    queryKey: ["payables"],
    queryFn: fetchPayables,
  });

  const {
    data: vendorResults,
    isLoading: isLoadingVendors,
    isError: isVendorsError,
    refetch: searchVendorQuery,
  } = useQuery({
    queryKey: ["vendors", searchTerm],
    queryFn: () => searchVendors(searchTerm),
    enabled: false,
  });

  const addPayableMutation = useMutation({
    mutationFn: addPayable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payables"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setNewPayable({
        vendorId: "",
        vendorName: "",
        vendorMobile: "",
        serviceType: "",
        paymentAmount: 0,
        paymentStatus: "",
        invoiceNumber: "",
      });
      setSelectedVendor(null);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    },
  });

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    searchVendorQuery().finally(() => setIsSearching(false));
  };

  const handleSelectVendor = (vendor) => {
    setSelectedVendor(vendor);
    setNewPayable({
      ...newPayable,
      vendorId: vendor._id,
      vendorName: vendor.name,
      vendorMobile: vendor.mobile,
    });
  };

  const handleAddPayable = (e) => {
    e.preventDefault();
    console.log("entered handle add payable");
    console.log(newPayable.vendorId);
    console.log(newPayable.serviceType);
    console.log(newPayable.paymentStatus);
    if (
      !newPayable.vendorId ||
      !newPayable.serviceType ||
      !newPayable.paymentStatus
    )
      return;
    console.log("running mutation");
    addPayableMutation.mutate(newPayable);
  };
  const resetForm = () => {
    setSelectedVendor(null);
    setNewPayable({
      vendorId: "",
      vendorName: "",
      vendorMobile: "",
      serviceType: "",
      paymentAmount: 0,
      paymentStatus: "",
      invoiceNumber: "",
    });
  };

  return (
    <Container>
      <Title>Payables Management</Title>

      {isLoadingPayables ? (
        <Loader />
      ) : isPayablesError ? (
        <EmptyState>Error loading payables, Please try again</EmptyState>
      ) : payables.length === 0 ? (
        <EmptyState>No receivables found</EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Customer</Th>
              <Th>Contact</Th>
              <Th>Service Type</Th>
              <Th>Amount</Th>
              <Th>Payment Status</Th>
              <Th>Invoice No.</Th>
            </tr>
          </thead>
          <tbody>
            {payables?.map((payable, index) => (
              <TrStriped key={payable._id} index={index}>
                <Td>{payable.vendorName}</Td>
                <Td>{payable.vendorMobile}</Td>
                <Td>{payable.serviceType}</Td>
                <Td>{`₹ ${payable.paymentAmount}`}</Td>
                <Td>{payable.paymentStatus}</Td>
                <Td>{payable.invoiceNumber ? payable.invoiceNumber : "NA"}</Td>
              </TrStriped>
            ))}
          </tbody>
        </Table>
      )}
      <SectionTitle>Add New Payable</SectionTitle>
      {!selectedVendor && (
        <>
          <SearchContainer>
            <Input
              type="text"
              placeholder="Search vendor by name or phone number..."
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

          {/* vendor Search Results */}
          {isSearching ? (
            <Loader />
          ) : isLoadingVendors ? (
            <Loader />
          ) : isVendorsError ? (
            <EmptyState>Error searching vendors. Please try again.</EmptyState>
          ) : vendorResults?.length === 0 ? (
            searchTerm && (
              <EmptyState>No vendors found matching your search.</EmptyState>
            )
          ) : (
            vendorResults?.length > 0 && (
              <CustomerResults>
                {vendorResults.map((vendor) => (
                  <CustomerCard key={vendor._id}>
                    {console.log(vendor)}
                    <CustomerInfo>
                      <CustomerName>{vendor.name}</CustomerName>
                      <CustomerPhone>{vendor.mobile}</CustomerPhone>
                    </CustomerInfo>
                    <Button onClick={() => handleSelectVendor(vendor)}>
                      Select
                    </Button>
                  </CustomerCard>
                ))}
              </CustomerResults>
            )
          )}
        </>
      )}

      {selectedVendor && (
        <FormCard>
          {showSuccessMessage && (
            <SuccessMessage>Payable Added Successfully</SuccessMessage>
          )}

          <FormGroup>
            <Label>Vendor</Label>
            <Input type="text" value={selectedVendor.name} disabled />
          </FormGroup>

          <FormGroup>
            <Label>Contact</Label>
            <Input disabled type="text" value={selectedVendor.mobile} />
          </FormGroup>

          <FormGroup>
            <Label>Service Type*</Label>
            <Input
              type="text"
              value={newPayable.serviceType}
              onChange={(e) =>
                setNewPayable({
                  ...newPayable,
                  serviceType: e.target.value,
                })
              }
              placeholder="E.g., Repair, Installation, Maintenance"
            />
          </FormGroup>

          <FormGroup>
            <Label>Payment Status</Label>
            <Select
              value={newPayable.paymentStatus}
              onChange={(e) => {
                setNewPayable({
                  ...newPayable,
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
              value={newPayable.paymentAmount}
              onChange={(e) =>
                setNewPayable({
                  ...newPayable,
                  paymentAmount: e.target.value,
                })
              }
              placeholder="Enter amount"
            />
          </FormGroup>

          <FormGroup>
            <Label>Invoice Number</Label>
            <Input
              type="text"
              value={newPayable.invoiceNumber}
              onChange={(e) =>
                setNewPayable({
                  ...newPayable,
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
              onClick={handleAddPayable}
              disabled={
                addPayableMutation.isLoading ||
                !newPayable.serviceType ||
                !newPayable.paymentAmount
              }
            >
              {addPayableMutation.isLoading ? "Adding..." : "Add Payable"}
            </Button>
          </ButtonGroup>
        </FormCard>
      )}
    </Container>
  );
};

export default Payables;

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
