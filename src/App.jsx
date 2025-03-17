import PropTypes from "prop-types";
import React, { Suspense } from "react";
import { ThemeProvider } from "./context/ThemeProvider";
import { GlobalStyles } from "./config/globalStyles";
import { QueryProvider } from "./context/QueryProvider";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { routes } from "./config/routes";

// Layouts
const AppLayout = React.lazy(() => import("./layouts/AppLayout"));
// const AuthLayout = React.lazy(() => import("./layouts/AuthLayout"));

// Components
const LoadingFallback = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    Loading...
  </div>
);

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = true; // Replace with actual auth check
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

const App = () => {
  return (
    <ThemeProvider>
      <GlobalStyles />
      <QueryProvider>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {routes.map((route) =>
                  route.children ? (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={route.element}
                    >
                      {route.children.map((child) => (
                        <Route
                          key={child.path}
                          path={child.path}
                          element={child.element}
                        />
                      ))}
                    </Route>
                  ) : (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={route.element}
                    />
                  )
                )}
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
};

export default App;
