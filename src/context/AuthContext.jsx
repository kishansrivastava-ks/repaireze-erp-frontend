/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/services/authService";
import PropTypes from "prop-types";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // stores the authenticated user
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Initializes authentication state when the component mounts.
   * Retrieves the user from localStorage (if available).
   */
  useEffect(() => {
    const initAuth = () => {
      const user = authService.getUser(); // fetching from the local storage
      setUser(user);
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (phone, password) => {
    setIsLoading(true);
    try {
      const response = await authService.login({ phone, password });
      //   🔴 API HAS 2 STEP LOGIN PROCESS, CHECK THIS
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user, // to check if the user is logged in
        isLoading, // would work for login, logout and getting the user data
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook to access authentication context.
 * Ensures that it is only used within an `AuthProvider`.
 * @returns {Object} Auth context values (user, login, logout, etc.)
 */

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
