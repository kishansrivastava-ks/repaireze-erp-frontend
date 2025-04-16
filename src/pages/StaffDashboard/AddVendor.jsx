import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchVendors, addVendor } from "@/utils/api";
import styled from "styled-components";
import api from "@/services/api";
import { errorToast, infoToast, successToast } from "@/utils/ToastNotfications";
import { Edit } from "lucide-react";
import Modal from "@/utils/Modal";
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

  // ----EDITING FEATURE ----
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [editedData, setEditedData] = useState({});

  const updateVendorApi = async ({ vendorId, data }) => {
    await api.patch(`/vendors/${vendorId}/update`, data);
  };

  const updateVendorMutation = useMutation({
    mutationFn: updateVendorApi,
    onSuccess: () => {
      successToast("Vendor updated successfully!");
      queryClient.invalidateQueries(["vendors"]);
      handleCloseEditModal();
    },
    onError: (error) => {
      errorToast("Error updating vendor!");
      console.error("Error updating vendor:", error);
    },
  });

  const handleOpenEditModal = (vendor) => {
    setEditingVendor(vendor);
    setEditedData({
      name: vendor.name || "",
      mobile: vendor.mobile || "",
      category: vendor.category || "",
      address: vendor.address || "",
      alternateMobile: vendor.alternateMobile || "",
    });
    setIsEditingModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditingModalOpen(false);
    setEditingVendor(null);
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

    if (!editingVendor) return;

    const payload = {};

    // determine changed fields
    if (editedData.name !== editingVendor.name) payload.name = editedData.name;
    if (editedData.mobile !== editingVendor.mobile)
      payload.mobile = editedData.mobile;
    if (editedData.category !== editingVendor.category)
      payload.category = editedData.category;
    if (editedData.address !== editingVendor.address)
      payload.address = editedData.address;
    if (editedData.alternateMobile !== editingVendor.alternateMobile)
      payload.alternateMobile = editedData.alternateMobile;

    if (Object.keys(payload).length === 0) {
      infoToast("No changes detected!");
      handleCloseEditModal();
      return;
    }

    // trigger the mutation if there are changes
    updateVendorMutation.mutate({
      vendorId: editingVendor._id,
      data: payload,
    });
  };

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
              <Th>Actions</Th>
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
                <Td>
                  <Edit
                    onClick={() => handleOpenEditModal(vendor)}
                    title="Edit Vendor"
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

      {/* ----Editing vendor modal --- */}
      {editingVendor && (
        <Modal
          isOpen={isEditingModalOpen}
          onClose={handleCloseEditModal}
          title={`Edit vendor: ${editingVendor.name}`}
          footerContent={
            <>
              <Button secondary onClick={handleCloseEditModal}>
                Cancel
              </Button>
              <Button
                disabled={updateVendorMutation.isPending}
                onClick={handleSaveChanges}
              >
                {updateVendorMutation.isPending ? "Saving..." : "Save Changes"}
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
                placeholder="Vendor Name"
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
                maxLength={10}
              />
            </FormGroup>
            <FormGroup>
              <Label>Category</Label>
              <EditInput
                type="text"
                name="category"
                value={editedData.category || ""}
                onChange={handleEditInputChange}
                placeholder="Category"
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
            <FormGroup>
              <Label>Alternate Mobile</Label>
              <EditInput
                type="text"
                name="alternateMobile"
                value={editedData.alternateMobile || ""}
                onChange={handleEditInputChange}
                placeholder="Alternate Mobile"
                maxLength={10}
              />
            </FormGroup>
          </EditForm>
        </Modal>
      )}
    </Container>
  );
};

export default AddVendor;

// EDITING VENDOR MODAL
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
