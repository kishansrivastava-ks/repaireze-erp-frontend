import React, { Suspense } from "react";
import styled from "styled-components";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const SidebarContainer = styled.aside`
  width: 250px;
  background-color: ${({ theme }) => theme.colors.dark};
  color: white;
  padding: ${({ theme }) => theme.space.md};
`;

const ContentContainer = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.space.md};
  overflow-y: auto;
`;

const LoadingContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const AppLayout = () => {
  return (
    <LayoutContainer>
      <SidebarContainer>
        {/* Sidebar content goes here */}
        <h2>ERP System</h2>
        {/* Navigation menu will go here */}
      </SidebarContainer>

      <ContentContainer>
        <Suspense
          fallback={
            <LoadingContainer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Loading...
            </LoadingContainer>
          }
        >
          <Outlet />
        </Suspense>
      </ContentContainer>
    </LayoutContainer>
  );
};

export default AppLayout;
