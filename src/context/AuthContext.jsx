/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from "react";
import { authService } from "@/services/authService";
import PropTypes from "prop-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  // const [user, setUser] = useState(() => authService.getUser());
  // const [isLoading, setIsLoading] = useState(true);

  // 🔴 USING QUERY
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: authService.getUser,
    staleTime: 1000 * 60 * 10, // cache for 10mins
  });

  const loginMutation = useMutation({
    mutationFn: async ({ phone, password }) => {
      console.log(phone, password);
      const userData = await authService.login({ phone, password });
      queryClient.setQueryData(["authUser"], userData);
      return userData;
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await authService.logout();
      queryClient.setQueryData(["authUser"], null); // clear cache
    },
  });

  /**
   * Initializes authentication state when the component mounts.
   * Retrieves the user from localStorage (if available).
  //  */
  // useEffect(() => {
  //   const initAuth = () => {
  //     const user = authService.getUser();
  //     console.log(authService.getUser());
  //     setUser(user);
  //     setIsLoading(false);
  //   };

  //   initAuth();
  // }, []);

  // const login = async (phone, password) => {
  //   setIsLoading(true);
  //   try {
  //     const response = await authService.login({ phone, password });
  //     setUser(response.user);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const logout = async () => {
  //   setIsLoading(true);
  //   try {
  //     await authService.logout();
  //     setUser(null);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user, // to check if the user is logged in
        isLoading,
        login: loginMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
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
