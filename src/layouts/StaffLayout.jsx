import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronUp, TrendingUp } from "lucide-react";

// Icons can be represented as SVG components
const ProfileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const ServicesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
  </svg>
);

const CustomersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const VendorsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);

const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const CollapseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const Container = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f8f9fa;
  overflow: hidden;
`;

const Sidebar = styled(motion.nav)`
  width: ${(props) => (props.collapsed ? "70px" : "250px")};
  background: linear-gradient(180deg, #2c3e50 0%, #1a252f 100%);
  display: flex;
  flex-direction: column;
  padding: ${(props) => (props.collapsed ? "1rem 0.5rem" : "1rem")};
  justify-content: space-between;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease;
  overflow-y: auto;
  z-index: 10;
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.collapsed ? "center" : "space-between")};
  padding: ${(props) => (props.collapsed ? "0.5rem" : "0.5rem 1rem")};
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Logo = styled.div`
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: white;
  display: ${(props) => (props.collapsed ? "none" : "block")};
`;

const CompanyInitial = styled.div`
  display: ${(props) => (props.collapsed ? "flex" : "none")};
  width: 40px;
  height: 40px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

const CollapseButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 50%;
  transition:
    background 0.2s,
    transform 0.2s;
  transform: ${(props) =>
    props.collapsed ? "rotate(180deg)" : "rotate(0deg)"};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

const NavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SidebarLink = styled(NavLink)`
  padding: ${(props) => (props.collapsed ? "1rem 0.5rem" : "1rem")};
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-weight: 500;
  border-radius: 8px;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;

  &.active {
    color: white;
    background: rgba(0, 112, 243, 0.2);
    font-weight: 600;
  }

  &.active::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background-color: ${({ theme }) => theme.colors.primary};
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

const LinkIcon = styled.div`
  margin-right: ${(props) => (props.collapsed ? "0" : "12px")};
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => (props.collapsed ? "100%" : "auto")};
`;

const LinkText = styled.span`
  display: ${(props) => (props.collapsed ? "none" : "block")};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LogoutButton = styled.button`
  padding: ${(props) => (props.collapsed ? "1rem 0.5rem" : "1rem")};
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.collapsed ? "center" : "flex-start")};
  transition: all 0.2s;
  margin-top: 1rem;

  &:hover {
    background-color: rgba(220, 53, 69, 0.2);
  }
`;

const LogoutText = styled.span`
  margin-left: ${(props) => (props.collapsed ? "0" : "12px")};
  display: ${(props) => (props.collapsed ? "none" : "block")};
`;

const Content = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TopBar = styled.header`
  background-color: white;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  z-index: 5;
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.dark};
  margin: 0;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.dark};
`;

const UserRole = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.darkGray};
`;

const MainContent = styled(motion.main)`
  flex-grow: 1;
  padding: 2rem;
  overflow-y: auto;
  background-color: #f8f9fa;
`;

const getPageTitle = (pathname) => {
  if (pathname.includes("/profile")) return "User Profile";
  if (pathname.includes("/add-service")) return "Manage Services";
  if (pathname.includes("/add-customer")) return "Customer Management";
  if (pathname.includes("/add-vendor")) return "Vendor Management";
  if (pathname.includes("/marketing-plans")) return "Marketing Plans";
  if (pathname.includes("marketing-campaigns")) return "Marketing Campaigns";
  return "Dashboard";
};

const StaffLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [marketingDropdownOpen, setMarketingDropdownOpen] = useState(false);

  const toggleMarketingDropdown = () => {
    setMarketingDropdownOpen(!marketingDropdownOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const pageTitle = getPageTitle(location.pathname);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return "U";
    return user.name
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Animation variants
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <Container>
      <Sidebar
        collapsed={collapsed}
        initial={false}
        animate={{ width: collapsed ? "70px" : "250px" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div>
          <SidebarHeader collapsed={collapsed}>
            {collapsed ? (
              <CompanyInitial collapsed={collapsed}>M</CompanyInitial>
            ) : (
              <Logo collapsed={collapsed}>Mendt ERP</Logo>
            )}
            <CollapseButton collapsed={collapsed} onClick={toggleSidebar}>
              <CollapseIcon />
            </CollapseButton>
          </SidebarHeader>
          <NavLinks>
            <SidebarLink
              to="/staff-dashboard/profile"
              collapsed={collapsed ? 1 : 0}
            >
              <LinkIcon collapsed={collapsed ? 1 : 0}>
                <ProfileIcon />
              </LinkIcon>
              <LinkText collapsed={collapsed ? 1 : 0}>Profile</LinkText>
            </SidebarLink>
            <SidebarLink
              to="/staff-dashboard/add-service"
              collapsed={collapsed ? 1 : 0}
            >
              <LinkIcon collapsed={collapsed ? 1 : 0}>
                <ServicesIcon />
              </LinkIcon>
              <LinkText collapsed={collapsed ? 1 : 0}>Services</LinkText>
            </SidebarLink>
            <SidebarLink
              to="/staff-dashboard/add-customer"
              collapsed={collapsed ? 1 : 0}
            >
              <LinkIcon collapsed={collapsed ? 1 : 0}>
                <CustomersIcon />
              </LinkIcon>
              <LinkText collapsed={collapsed ? 1 : 0}>Customers</LinkText>
            </SidebarLink>
            <SidebarLink
              to="/staff-dashboard/add-vendor"
              collapsed={collapsed ? 1 : 0}
            >
              <LinkIcon collapsed={collapsed ? 1 : 0}>
                <VendorsIcon />
              </LinkIcon>
              <LinkText collapsed={collapsed ? 1 : 0}>Vendors</LinkText>
            </SidebarLink>
            <SidebarLink
              onClick={toggleMarketingDropdown}
              collapsed={collapsed ? 1 : 0}
            >
              <LinkIcon collapsed={collapsed ? 1 : 0}>
                <TrendingUp />
              </LinkIcon>
              <LinkText collapsed={collapsed ? 1 : 0}> Marketing</LinkText>
              <DropdownIcon rotated={marketingDropdownOpen ? 1 : 0}>
                <ChevronDown />
              </DropdownIcon>
            </SidebarLink>
            {marketingDropdownOpen && (
              <DropdownMenu collapsed={collapsed ? 1 : 0}>
                <DropdownItem to="/staff-dashboard/marketing-plans">
                  Marketing Plans
                </DropdownItem>
                <DropdownItem to="/staff-dashboard/marketing-campaigns">
                  Marketing Campaigns
                </DropdownItem>
              </DropdownMenu>
            )}
          </NavLinks>
        </div>
        <LogoutButton onClick={handleLogout} collapsed={collapsed ? 1 : 0}>
          <LogoutIcon />
          <LogoutText collapsed={collapsed ? 1 : 0}>Logout</LogoutText>
        </LogoutButton>
      </Sidebar>
      <Content>
        <TopBar>
          <PageTitle>{pageTitle}</PageTitle>
          <UserInfo>
            <UserDetails>
              <UserName>{user?.name || "Staff User"}</UserName>
              <UserRole>Staff</UserRole>
            </UserDetails>
            <UserAvatar>{getUserInitials()}</UserAvatar>
          </UserInfo>
        </TopBar>
        <AnimatePresence mode="wait">
          <MainContent
            key={location.pathname}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <Outlet />
          </MainContent>
        </AnimatePresence>
      </Content>
    </Container>
  );
};

export default StaffLayout;

const DropdownMenu = styled.div`
  display: ${({ collapsed }) => (collapsed ? "none" : "block")};
  padding-left: 20px;
`;

const DropdownItem = styled(SidebarLink)`
  font-size: 14px;
  padding: 8px 16px;
`;

const DropdownIcon = styled.span`
  margin-left: auto;
  transform: ${({ rotated }) => (rotated ? "rotate(0)" : "rotate(-90deg)")};
  transition: transform 0.3s ease-in-out;
`;
