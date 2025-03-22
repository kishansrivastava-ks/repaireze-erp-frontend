/* eslint-disable no-unused-vars */
import { useAuth } from "@/context/AuthContext";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUserCircle,
  FaUsers,
  FaUserPlus,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { BiChevronRight } from "react-icons/bi";

// Container layout with responsive design
const Container = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  font-family: "Inter", "Segoe UI", sans-serif;
`;

// Sidebar with improved styling and mobile responsiveness
const Sidebar = styled(motion.nav)`
  width: ${(props) => (props.isCollapsed ? "80px" : "280px")};
  background: linear-gradient(180deg, #1a237e 0%, #283593 100%);
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0.75rem;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: width 0.3s ease;

  @media (max-width: 768px) {
    position: fixed;
    z-index: 100;
    left: ${(props) => (props.isMobileOpen ? "0" : "-280px")};
    width: 280px;
  }
`;

// Company logo and branding
const BrandContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0 0.5rem 1.5rem 0.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Logo = styled.div`
  font-size: ${(props) => (props.isCollapsed ? "0" : "1.4rem")};
  font-weight: 700;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  transition: font-size 0.3s ease;
  display: flex;
  align-items: center;

  span {
    font-weight: 300;
    font-size: ${(props) => (props.isCollapsed ? "0" : "1rem")};
    opacity: 0.8;
    margin-left: 5px;
    transition: font-size 0.3s ease;
  }

  &::before {
    content: "M";
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    color: #1a237e;
    width: ${(props) => (props.isCollapsed ? "40px" : "36px")};
    height: ${(props) => (props.isCollapsed ? "40px" : "36px")};
    border-radius: 8px;
    margin-right: ${(props) => (props.isCollapsed ? "0" : "12px")};
    font-weight: 800;
    font-size: ${(props) => (props.isCollapsed ? "24px" : "20px")};
  }
`;

// Toggle button for collapsing sidebar
const CollapseButton = styled.button`
  position: absolute;
  right: -14px;
  top: 80px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #ffffff;
  color: #1a237e;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  z-index: 10;
  transform: ${(props) =>
    props.isCollapsed ? "rotate(180deg)" : "rotate(0deg)"};
  transition: transform 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

// Mobile menu toggle button
const MobileMenuButton = styled.button`
  display: none;
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 101;
  background-color: #1a237e;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  @media (max-width: 768px) {
    display: flex;
  }
`;

// Navigation links container
const NavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-grow: 1;
`;

// Enhanced sidebar link with icons
const SidebarLink = styled(NavLink)`
  padding: ${(props) =>
    props.iscollapsed === "true" ? "1rem 0.5rem" : "1rem"};
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-weight: 500;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: ${(props) =>
    props.iscollapsed === "true" ? "center" : "flex-start"};
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease-in-out;

  svg {
    font-size: 1.2rem;
    min-width: ${(props) => (props.iscollapsed === "true" ? "auto" : "24px")};
    margin-right: ${(props) => (props.iscollapsed === "true" ? "0" : "10px")};
  }

  span {
    white-space: nowrap;
    opacity: ${(props) => (props.iscollapsed === "true" ? "0" : "1")};
    width: ${(props) => (props.iscollapsed === "true" ? "0" : "auto")};
    transition:
      opacity 0.2s ease,
      width 0.2s ease;
  }

  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 0;
    background-color: #3949ab;
    z-index: -1;
    transition: width 0.2s ease-in-out;
  }

  &.active {
    color: white;
    background: rgba(255, 255, 255, 0.15);
    font-weight: 600;

    &::after {
      width: 4px;
    }
  }

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: white;
  }
`;

// Improved logout button
const LogoutButton = styled(motion.button)`
  padding: ${(props) =>
    props.iscollapsed === "true" ? "1rem 0.5rem" : "1rem"};
  background-color: rgba(220, 38, 38, 0.1);
  color: #ef5350;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-align: ${(props) => (props.iscollapsed === "true" ? "center" : "left")};
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: ${(props) =>
    props.iscollapsed === "true" ? "center" : "flex-start"};
  transition: all 0.2s ease;

  svg {
    font-size: 1.2rem;
    min-width: ${(props) => (props.iscollapsed === "true" ? "auto" : "24px")};
    margin-right: ${(props) => (props.iscollapsed === "true" ? "0" : "10px")};
  }

  span {
    white-space: nowrap;
    opacity: ${(props) => (props.iscollapsed === "true" ? "0" : "1")};
    width: ${(props) => (props.iscollapsed === "true" ? "0" : "auto")};
    transition:
      opacity 0.2s ease,
      width 0.2s ease;
  }

  &:hover {
    background-color: rgba(220, 38, 38, 0.15);
    color: #f44336;
  }
`;

// Content area with page transition effects
const Content = styled(motion.div)`
  flex-grow: 1;
  padding: 1.5rem 2rem;
  background-color: #f8f9fa;
  overflow-y: auto;
  position: relative;

  @media (max-width: 768px) {
    padding: 4rem 1.5rem 1.5rem;
  }
`;

// Page breadcrumb
const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  color: #64748b;
  font-size: 0.9rem;

  span {
    margin: 0 8px;
  }
`;

// Toast notification component
const Toast = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: ${(props) =>
    props.type === "success" ? "#4caf50" : "#f44336"};
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 10px;
`;

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
};

// Toast variants
const toastVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 50 },
};

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle page navigation for breadcrumb
  const getPageTitle = () => {
    const path = location.pathname.split("/").pop();
    switch (path) {
      case "profile":
        return "User Profile";
      case "staffs":
        return "Staff Management";
      case "add-staff":
        return "Add New Staff";
      default:
        return "Dashboard";
    }
  };

  // Handle logout with loading state and toast
  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      setToast({ type: "success", message: "Successfully logged out" });
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setToast({
        type: "error",
        message: "Failed to logout. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Clear toast after display
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Close mobile menu when navigating
  useEffect(() => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  }, [isMobileOpen, location.pathname]);

  return (
    <Container>
      <Sidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <BrandContainer>
          <Logo isCollapsed={isCollapsed}>
            {!isCollapsed && (
              <>
                endt <span>Technologies</span>
              </>
            )}
          </Logo>
        </BrandContainer>

        <CollapseButton
          isCollapsed={isCollapsed}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <BiChevronRight size={18} />
        </CollapseButton>

        <NavLinks>
          <SidebarLink
            to="/admin-dashboard/profile"
            iscollapsed={isCollapsed.toString()}
          >
            <FaUserCircle />
            <span>Profile</span>
          </SidebarLink>
          <SidebarLink
            to="/admin-dashboard/staffs"
            iscollapsed={isCollapsed.toString()}
          >
            <FaUsers />
            <span>Staffs</span>
          </SidebarLink>
          <SidebarLink
            to="/admin-dashboard/add-staff"
            iscollapsed={isCollapsed.toString()}
          >
            <FaUserPlus />
            <span>Add Staff</span>
          </SidebarLink>
        </NavLinks>

        <LogoutButton
          onClick={handleLogout}
          iscollapsed={isCollapsed.toString()}
          disabled={loading}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{
                width: "18px",
                height: "18px",
                border: "2px solid rgba(255,255,255,0.3)",
                borderTop: "2px solid #f44336",
                borderRadius: "50%",
              }}
            />
          ) : (
            <>
              <FaSignOutAlt />
              <span>Logout</span>
            </>
          )}
        </LogoutButton>
      </Sidebar>

      <MobileMenuButton onClick={() => setIsMobileOpen(!isMobileOpen)}>
        {isMobileOpen ? <FaTimes /> : <FaBars />}
      </MobileMenuButton>

      <Content
        as={motion.div}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <Breadcrumb>
          Dashboard <span>›</span> {getPageTitle()}
        </Breadcrumb>

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            style={{ height: "100%" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </Content>

      <AnimatePresence>
        {toast && (
          <Toast
            type={toast.type}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={toastVariants}
          >
            {toast.type === "success" ? "✓" : "✗"} {toast.message}
          </Toast>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default AdminLayout;
