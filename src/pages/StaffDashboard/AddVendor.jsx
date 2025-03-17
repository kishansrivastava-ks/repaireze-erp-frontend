import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchVendors, addVendor } from "@/utils/api";
import styled from "styled-components";
// import { toast } from "react-hot-toast";

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
  max-width: 600px;
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

const FormButton = styled(Button)`
  width: 100%;
  max-width: 200px;
`;

const AddButton = styled(Button)`
  margin: 0 auto 2rem;
  width: auto;
  padding: 0.8rem 1.5rem;
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

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.secondary};
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

const InfoBadge = styled.span`
  background-color: ${({ theme, type }) => {
    switch (type) {
      case "new":
        return theme.colors.success || "#4caf50";
      default:
        return theme.colors.muted;
    }
  }};
  color: white;
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 0.75rem;
  margin-left: 0.5rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;
`;

const AddVendor = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [newVendorId, setNewVendorId] = useState(null);
  const [vendorData, setVendorData] = useState({
    name: "",
    mobile: "",
    category: "",
    address: "",
    alternateMobile: "",
  });

  const { data: vendors = [], isLoading } = useQuery({
    queryKey: ["vendors"],
    queryFn: fetchVendors,
  });

  const mutation = useMutation({
    mutationFn: addVendor,
    onSuccess: (newVendor) => {
      queryClient.invalidateQueries(["vendors"]);
      // toast.success("Vendor added successfully!");
      alert("Vendor added successfully!");

      setNewVendorId(newVendor._id);
      setTimeout(() => setNewVendorId(null), 5000); // Clear "new" badge after 5 seconds

      setVendorData({
        name: "",
        mobile: "",
        category: "",
        address: "",
        alternateMobile: "",
      });

      setShowForm(false);
    },
    onError: () => {
      // toast.error("Error adding vendor.");
      alert("Error adding vendor.");
    },
  });

  const handleChange = (e) => {
    setVendorData({ ...vendorData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(vendorData);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const cancelForm = () => {
    setShowForm(false);
    setVendorData({
      name: "",
      mobile: "",
      category: "",
      address: "",
      alternateMobile: "",
    });
  };

  return (
    <Container>
      <Title>Vendor Management</Title>

      {!showForm ? (
        <AddButton onClick={toggleForm}>+ Add New Vendor</AddButton>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="name"
            placeholder="Vendor Name"
            value={vendorData.name}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={vendorData.mobile}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="category"
            placeholder="Vendor Category"
            value={vendorData.category}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="address"
            placeholder="Address"
            value={vendorData.address}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="alternateMobile"
            placeholder="Alternate Mobile (Optional)"
            value={vendorData.alternateMobile}
            onChange={handleChange}
          />
          <ButtonGroup>
            <FormButton type="submit" disabled={mutation.isLoading}>
              {mutation.isLoading ? (
                <>
                  <LoadingSpinner /> Adding...
                </>
              ) : (
                "Add Vendor"
              )}
            </FormButton>
            <CancelButton type="button" onClick={cancelForm}>
              Cancel
            </CancelButton>
          </ButtonGroup>
        </Form>
      )}

      <Title>Vendors List</Title>
      {isLoading ? (
        <LoadingContainer>
          <LoadingSpinner />
          <p>Loading vendors...</p>
        </LoadingContainer>
      ) : vendors.length === 0 ? (
        <EmptyState>
          <p>No vendors found. Add your first vendor!</p>
        </EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Category</Th>
              <Th>Mobile</Th>
              <Th>Alt. Mobile</Th>
              <Th>Address</Th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <TableRow key={vendor._id}>
                <Td>
                  {vendor.name}
                  {newVendorId === vendor._id && (
                    <InfoBadge type="new">New</InfoBadge>
                  )}
                </Td>
                <Td>{vendor.category}</Td>
                <Td>{vendor.mobile}</Td>
                <Td>{vendor.alternateMobile || "N/A"}</Td>
                <Td>{vendor.address}</Td>
              </TableRow>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AddVendor;
