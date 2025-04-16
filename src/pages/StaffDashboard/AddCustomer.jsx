/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCustomers, addCustomer } from "@/utils/api";
import styled from "styled-components";
import api from "@/services/api";
import { errorToast, infoToast, successToast } from "@/utils/ToastNotfications";
import { FaEdit } from "react-icons/fa";
import Modal from "@/utils/Modal";
import { Edit } from "lucide-react";
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
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin: 1rem auto;
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
  padding: 0.8rem;
  border: 1px solid ${({ theme }) => theme.colors.muted};
  border-radius: 5px;
  font-size: 1rem;

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

  &:hover {
    background-color: ${({ theme }) => theme.colors.lightGray};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
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

const AddCustomer = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [newCustomerId, setNewCustomerId] = useState(null);
  const [customerData, setCustomerData] = useState({
    name: "",
    mobile: "",
    gstNumber: "",
    dob: "",
    address: "",
  });

  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null); // holds the customer being edited
  const [editedData, setEditedData] = useState({}); // holds the changes made in the modal form

  const updateCustomerApi = async ({ customerId, data }) => {
    await api.patch(`/customers/${customerId}/update`, data);
  };

  const updateCustomerMutation = useMutation({
    mutationFn: updateCustomerApi,
    onSuccess: () => {
      successToast("Customer updated successfully!");
      queryClient.invalidateQueries(["customers"]);
      handleCloseEditModal();
    },
    onError: (error) => {
      errorToast("Error updating customer!");
      console.error("Error updating customer:", error);
    },
  });

  const handleOpenEditModal = (customer) => {
    setEditingCustomer(customer);
    setEditedData({
      name: customer.name || "",
      mobile: customer.mobile || "",
      gstNumber: customer.gstNumber || "",
      dob: customer.dob || "",
      address: customer.address || "",
    });
    setIsEditingModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditingModalOpen(false);
    setEditingCustomer(null);
    setEditedData({});
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;

    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();

    if (!editingCustomer) return;

    const payload = {};

    // determine changed fields
    if (editedData.name !== editingCustomer.name)
      payload.name = editedData.name;
    if (editedData.mobile !== editingCustomer.mobile)
      payload.mobile = editedData.mobile;
    if (editedData.gstNumber !== editingCustomer.gstNumber)
      payload.gstNumber = editedData.gstNumber;
    if (editedData.dob !== editingCustomer.dob) payload.dob = editedData.dob;
    if (editedData.address !== editingCustomer.address)
      payload.address = editedData.address;

    // if no change detected, inform user and return
    if (Object.keys(payload).length === 0) {
      infoToast("No changes detected!");
      handleCloseEditModal();
      return;
    }

    // trigger the mutation if there are changes
    updateCustomerMutation.mutate({
      customerId: editingCustomer._id,
      data: payload,
    });
  };

  const { data: customers = [], isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });

  const mutation = useMutation({
    mutationFn: addCustomer,
    onSuccess: (newCustomer) => {
      queryClient.invalidateQueries(["customers"]);
      setNewCustomerId(newCustomer._id);
      setTimeout(() => setNewCustomerId(null), 5000); // Clear "new" badge after 5 seconds

      // Show success message
      alert("Customer added successfully");
      // toast.success("Customer added successfully!");

      // Reset form and hide it
      setCustomerData({
        name: "",
        mobile: "",
        gstNumber: "",
        dob: "",
        address: "",
      });
      setShowForm(false);
    },
    onError: () => {
      alert("Error adding customer");
      // toast.error("Error adding customer.");
    },
  });

  const handleChange = (e) => {
    setCustomerData({ ...customerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(customerData);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const cancelForm = () => {
    setShowForm(false);
    setCustomerData({
      name: "",
      mobile: "",
      gstNumber: "",
      dob: "",
      address: "",
    });
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Container>
      <Title>Customer Management</Title>

      {!showForm ? (
        <AddButton onClick={toggleForm}>+ Add New Customer</AddButton>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="name"
            placeholder="Customer Name"
            value={customerData.name}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={customerData.mobile}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="gstNumber"
            placeholder="GST Number (Optional)"
            value={customerData.gstNumber}
            onChange={handleChange}
          />
          <Input
            type="date"
            name="dob"
            placeholder="Date of Birth"
            value={customerData.dob}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="address"
            placeholder="Address"
            value={customerData.address}
            onChange={handleChange}
            required
          />
          <ButtonGroup>
            <Button type="submit" disabled={mutation.isLoading}>
              {mutation.isLoading ? (
                <>
                  <LoadingSpinner /> Adding...
                </>
              ) : (
                "Add Customer"
              )}
            </Button>
            <CancelButton type="button" onClick={cancelForm}>
              Cancel
            </CancelButton>
          </ButtonGroup>
        </Form>
      )}

      <Title>Customer List</Title>
      {isLoadingCustomers ? (
        <EmptyState>
          <LoadingSpinner style={{ margin: "0 auto" }} />
          <p>Loading customers...</p>
        </EmptyState>
      ) : customers.length === 0 ? (
        <EmptyState>
          <p>No customers found. Add your first customer!</p>
        </EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Mobile</Th>
              <Th>GST Number</Th>
              <Th>DOB</Th>
              <Th>Address</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <TableRow key={customer._id}>
                <Td>
                  {customer.name}
                  {newCustomerId === customer._id && (
                    <InfoBadge type="new">New</InfoBadge>
                  )}
                </Td>
                <Td>{customer.mobile}</Td>
                <Td>{customer.gstNumber || "N/A"}</Td>
                <Td>{formatDate(customer.dob)}</Td>
                <Td>{customer.address}</Td>
                <Td>
                  <Edit
                    onClick={() => handleOpenEditModal(customer)}
                    title="Edit Customer"
                    style={{
                      cursor: "pointer",
                      color: "var(--primary-color, blue)",
                      fontSize: "1.1em",
                    }}
                  />
                </Td>
              </TableRow>
            ))}
          </tbody>
        </Table>
      )}

      {/* ----Editing customer modal --- */}
      {editingCustomer && (
        <Modal
          isOpen={isEditingModalOpen}
          onClose={handleCloseEditModal}
          title={`Edit Customer: ${editingCustomer.name}`}
          footerContent={
            <>
              <Button secondary onClick={handleCloseEditModal}>
                Cancel
              </Button>
              <Button
                disabled={updateCustomerMutation.isPending}
                onClick={handleSaveChanges}
              >
                {updateCustomerMutation.isPending
                  ? "Saving..."
                  : "Save Changes"}
              </Button>
            </>
          }
        >
          <EditForm onSubmit={handleSaveChanges}>
            <FormGroup>
              <Label>Name</Label>
              <EditInput
                type="text"
                name="name"
                value={editedData.name || ""}
                onChange={handleEditInputChange}
                placeholder="Customer Name"
              />
            </FormGroup>
            <FormGroup>
              <Label>Mobile</Label>
              <EditInput
                type="text"
                name="mobile"
                value={editedData.mobile || ""}
                onChange={handleEditInputChange}
                placeholder="Mobile Number"
              />
            </FormGroup>
            <FormGroup>
              <Label>GST Number</Label>
              <EditInput
                type="text"
                name="gstNumber"
                value={editedData.gstNumber || ""}
                onChange={handleEditInputChange}
                placeholder="GST Number (Optional)"
              />
            </FormGroup>
            <FormGroup>
              <Label>DOB</Label>
              <EditInput
                type="date"
                name="dob"
                value={editedData.dob || ""}
                onChange={handleEditInputChange}
                placeholder="Date of Birth"
              />
            </FormGroup>
            <FormGroup>
              <Label>Address</Label>
              <EditInput
                type="text"
                name="address"
                value={editedData.address || ""}
                onChange={handleEditInputChange}
                placeholder="Address"
              />
            </FormGroup>
          </EditForm>
        </Modal>
      )}
    </Container>
  );
};

export default AddCustomer;

// EDITING CUSTOMER MODAL
const EditForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 24px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;

  &.full-width {
    grid-column: 1 / -1;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #464646;
  font-size: 0.9rem;
  transition: color 0.2s ease;
`;

const EditInput = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #333;
  background-color: #fff;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &:hover:not(:focus) {
    border-color: #d0d0d0;
  }

  &::placeholder {
    color: #a0a0a0;
  }

  &[type="date"] {
    padding: 10px 14px;
  }
`;
