import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchStaffs } from "@/utils/api";
import styled from "styled-components";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUserTie,
  FaPhone,
  FaUserCog,
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaUserPlus,
  FaTrash,
} from "react-icons/fa";
import api from "@/services/api";
import { errorToast, successToast } from "@/utils/ToastNotfications";
import ConfirmationDialog from "@/utils/ConfirmationDialog";

// Container with improved styling
const Container = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

// Page header with actions
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

// Page title with counter
const Title = styled.h2`
  color: #1a237e;
  margin: 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  font-size: 1.5rem;

  span {
    background-color: #e8eaf6;
    color: #3949ab;
    font-size: 0.875rem;
    padding: 0.25rem 0.6rem;
    border-radius: 20px;
    margin-left: 0.75rem;
    font-weight: 500;
  }
`;

// Search and filter container
const SearchContainer = styled.div`
  display: flex;
  gap: 0.75rem;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

// Search input
const SearchInput = styled.div`
  position: relative;

  input {
    padding: 0.6rem 1rem 0.6rem 2.5rem;
    border-radius: 6px;
    border: 1px solid #e0e0e0;
    width: 250px;
    font-size: 0.9rem;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: #3949ab;
      box-shadow: 0 0 0 3px rgba(57, 73, 171, 0.1);
    }

    @media (max-width: 768px) {
      width: 100%;
    }
  }

  svg {
    position: absolute;
    left: 0.8rem;
    top: 50%;
    transform: translateY(-50%);
    color: #9e9e9e;
    font-size: 1rem;
  }
`;

// Add staff button
const AddButton = styled(motion.button)`
  background-color: #3949ab;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #303f9f;
  }

  svg {
    font-size: 0.9rem;
  }
`;

// Table container
const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
`;

// Staff table
const StaffTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
  min-width: 600px;
`;

// Table header
const TableHead = styled.thead`
  background-color: #f5f5f5;

  th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: #424242;
    border-bottom: 1px solid #e0e0e0;
    position: relative;
  }
`;

// Sort button
const SortButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 0.25rem;
  display: inline-flex;
  align-items: center;
  color: #9e9e9e;

  &:hover {
    color: #424242;
  }

  svg {
    font-size: 0.9rem;
  }
`;

// Table body
const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid #e0e0e0;
    transition: background-color 0.2s ease;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: #f5f7ff;
    }
  }

  td {
    padding: 1rem;
    vertical-align: middle;
  }
`;

// Staff name with avatar
const StaffName = styled.div`
  display: flex;
  align-items: center;

  .avatar {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #e8eaf6;
    color: #3949ab;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    margin-right: 0.75rem;
  }

  .name {
    font-weight: 500;
  }
`;

// Status badge
const RoleBadge = styled.span`
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  background-color: ${(props) => {
    switch (props.role?.toLowerCase()) {
      case "admin":
        return "#fee2e2";
      case "manager":
        return "#e0f2fe";
      case "developer":
        return "#dcfce7";
      case "designer":
        return "#fef3c7";
      case "hr":
        return "#f3e8ff";
      default:
        return "#f3f4f6";
    }
  }};

  color: ${(props) => {
    switch (props.role?.toLowerCase()) {
      case "admin":
        return "#b91c1c";
      case "manager":
        return "#0369a1";
      case "developer":
        return "#166534";
      case "designer":
        return "#a16207";
      case "hr":
        return "#7e22ce";
      default:
        return "#6b7280";
    }
  }};
`;

// Phone number with icon
const PhoneDisplay = styled.div`
  display: flex;
  align-items: center;

  svg {
    color: #9e9e9e;
    margin-right: 0.5rem;
    font-size: 0.9rem;
  }
`;

// Loading animation
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
`;

const LoadingSpinner = styled(motion.div)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 3px solid #e0e0e0;
  border-top-color: #3949ab;
  margin-bottom: 1rem;
`;

const LoadingText = styled.p`
  color: #616161;
  font-size: 0.95rem;
  margin: 0;
`;

// Error display
const ErrorContainer = styled.div`
  padding: 2rem;
  text-align: center;
  background-color: #fef2f2;
  border-radius: 8px;
  border: 1px solid #fee2e2;
  color: #b91c1c;
`;

// Empty state
const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;

  svg {
    font-size: 3rem;
    color: #e0e0e0;
    margin-bottom: 1rem;
  }

  h3 {
    margin: 0 0 0.5rem;
    color: #424242;
    font-weight: 500;
  }

  p {
    margin: 0;
    color: #757575;
    max-width: 300px;
  }
`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

// const itemVariants = {
//   hidden: { opacity: 0, y: 10 },
//   visible: { opacity: 1, y: 0 },
// };

const Staffs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);

  // const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const queryClient = useQueryClient();

  const deleteStaffApi = async (staffId) => {
    await api.delete(`/auth/delete-staff/${staffId}`);
  };

  const deleteMutation = useMutation({
    mutationFn: deleteStaffApi,
    onSuccess: () => {
      successToast("Staff member deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["staffs"],
      });
      setIsConfirmOpen(false);
      setStaffToDelete(null);
      // setIsDeleteLoading(false);
    },
    onError: (error) => {
      errorToast(`Error deleting staff member: ${error.message}`);
      // setIsDeleteLoading(false);
      setIsConfirmOpen(false);
      setStaffToDelete(null);
    },
  });

  const {
    data: staffs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["staffs"],
    queryFn: fetchStaffs,
  });

  useEffect(() => {
    if (!user || user.userType !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  // Handle navigation to add staff page
  const handleAddStaff = () => {
    navigate("/admin-dashboard/add-staff");
  };

  // Handle sorting
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Get sorted staff list
  const getSortedStaffs = () => {
    if (!staffs) return [];
    const filteredStaffs = staffs.filter(
      (staff) =>
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.phone.includes(searchTerm) ||
        staff.staffRole.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      return [...filteredStaffs].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return filteredStaffs;
  };

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Render sort icon
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FaSort />;
    }
    return sortConfig.direction === "ascending" ? <FaSortUp /> : <FaSortDown />;
  };

  if (isLoading) {
    return (
      <Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <LoadingContainer>
          <LoadingSpinner
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <LoadingText>Loading staff members...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <ErrorContainer>
          <p>Error fetching staff members: {error.message}</p>
          <p>Please refresh the page or try again later.</p>
        </ErrorContainer>
      </Container>
    );
  }

  const sortedStaffs = getSortedStaffs();

  return (
    <Container initial="hidden" animate="visible" variants={containerVariants}>
      <Header>
        <Title>
          Staff Members
          <span>{staffs?.length || 0}</span>
        </Title>
        <SearchContainer>
          <SearchInput>
            <FaSearch />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchInput>
          <AddButton
            onClick={handleAddStaff}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaUserPlus />
            Add Staff
          </AddButton>
        </SearchContainer>
      </Header>

      {sortedStaffs.length > 0 ? (
        <TableContainer>
          <StaffTable>
            <TableHead>
              <tr>
                <th>
                  Name
                  <SortButton onClick={() => requestSort("name")}>
                    {renderSortIcon("name")}
                  </SortButton>
                </th>
                <th>
                  Phone Number
                  <SortButton onClick={() => requestSort("phone")}>
                    {renderSortIcon("phone")}
                  </SortButton>
                </th>
                <th>
                  Role
                  <SortButton onClick={() => requestSort("staffRole")}>
                    {renderSortIcon("staffRole")}
                  </SortButton>
                </th>
                <th>Actions</th>
              </tr>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {sortedStaffs.map((staff) => (
                  <motion.tr
                    key={staff._id}
                    // variants={itemVariants}
                    exit={{ opacity: 0 }}
                  >
                    <td>
                      <StaffName>
                        <div className="avatar">{getInitials(staff.name)}</div>
                        <div className="name">{staff.name}</div>
                      </StaffName>
                    </td>
                    <td>
                      <PhoneDisplay>
                        <FaPhone />
                        {staff.phone}
                      </PhoneDisplay>
                    </td>
                    <td>
                      <RoleBadge role={staff.staffRole}>
                        {staff.staffRole}
                      </RoleBadge>
                    </td>
                    <td>
                      <ActionButton
                        onClick={() => {
                          setStaffToDelete(staff._id);
                          setIsConfirmOpen(true);
                        }}
                        disabled={deleteMutation.isPending}
                        title="Delete Staff"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaTrash />
                      </ActionButton>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </StaffTable>
        </TableContainer>
      ) : (
        <EmptyState>
          <FaUserTie />
          <h3>No staff members found</h3>
          <p>Try adjusting your search or add new staff members.</p>
        </EmptyState>
      )}

      {isConfirmOpen && (
        <ConfirmationDialog
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={() => {
            if (staffToDelete) {
              deleteMutation.mutate(staffToDelete);
            }
          }}
          title="Confirm Deletion"
          message={`Are you sure you want to delete this staff member? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          isConfirming={deleteMutation.isPending}
        />
      )}
    </Container>
  );
};

export default Staffs;

const ActionButton = styled(motion.button)`
  background-color: transparent;
  border: none;
  color: #333;
  cursor: pointer;
`;
