import { useAuth } from "@/context/AuthContext";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.nav`
  width: 250px;
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;

const NavLinks = styled.div`
  display: flex;
  flex-direction: column;
`;

const SidebarLink = styled(NavLink)`
  padding: 1rem;
  color: white;
  text-decoration: none;
  font-weight: bold;
  border-radius: 5px;
  margin-bottom: 10px;
  transition: background 0.2s;

  &.active {
    background: rgba(255, 255, 255, 0.2);
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const LogoutButton = styled.button`
  padding: 1rem;
  background-color: red;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  margin-top: auto; /* Pushes logout button to the bottom */
  transition: background 0.2s;

  &:hover {
    background: darkred;
  }
`;

const Content = styled.div`
  flex-grow: 1;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.light};
`;

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <Container>
      <Sidebar>
        <NavLinks>
          <SidebarLink to="/admin-dashboard/profile">Profile</SidebarLink>
          <SidebarLink to="/admin-dashboard/staffs">Staffs</SidebarLink>
          <SidebarLink to="/admin-dashboard/add-staff">Add Staff</SidebarLink>
        </NavLinks>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Sidebar>
      <Content>
        <Outlet />
      </Content>
    </Container>
  );
};

export default AdminLayout;
