import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.nav`
  width: 250px;
  background-color: ${({ theme }) => theme.colors.secondary};
  display: flex;
  flex-direction: column;
  padding: 1rem;
  justify-content: space-between;
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
  margin-top: auto;
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

const StaffLayout = () => {
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
          <SidebarLink to="/staff-dashboard/profile">Profile</SidebarLink>
          <SidebarLink to="/staff-dashboard/add-service">Services</SidebarLink>
          <SidebarLink to="/staff-dashboard/add-customer">
            Customers
          </SidebarLink>
          <SidebarLink to="/staff-dashboard/add-vendor">Vendors</SidebarLink>
        </NavLinks>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Sidebar>
      <Content>
        <Outlet />
      </Content>
    </Container>
  );
};

export default StaffLayout;
